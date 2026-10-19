import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// In-memory rate limiting store (IP -> array of request timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10-minute window
const MAX_REQUESTS_PER_WINDOW = 5;

// Periodically purge old rate limit timestamps to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of rateLimitMap.entries()) {
      const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, valid);
      }
    }
  }, 15 * 60 * 1000);
}

function sanitizeText(str: string): string {
  return str
    .replace(/\0/g, "") // strip null bytes
    .replace(/[<>]/g, "") // strip angle brackets to prevent HTML/XSS injection
    .trim();
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      (forwardedFor ? forwardedFor.split(",")[0] : null) ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const now = Date.now();
    const timestamps = (rateLimitMap.get(ip) || []).filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    // 2. Parse JSON payload
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { name, email, message, hp_website } = body;

    // 3. Honeypot check: automated spam bots fill hidden fields
    if (hp_website) {
      // Return a fake success so bots don't adapt, but don't save to database
      return NextResponse.json({ success: true });
    }

    // 4. Strict type validation
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const cleanName = sanitizeText(name);
    const cleanEmail = sanitizeText(email).toLowerCase();
    const cleanMessage = sanitizeText(message);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 5. Length limits (prevent DoS and memory exhaustion)
    if (cleanName.length > 100) {
      return NextResponse.json(
        { error: "Name must be 100 characters or fewer" },
        { status: 400 }
      );
    }
    if (cleanEmail.length > 120) {
      return NextResponse.json(
        { error: "Email must be 120 characters or fewer" },
        { status: 400 }
      );
    }
    if (cleanMessage.length > 3000) {
      return NextResponse.json(
        { error: "Message must be 3000 characters or fewer" },
        { status: 400 }
      );
    }

    // 6. Email format validation
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Record rate limit hit
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    // 7. Store safely in Supabase
    const { error } = await supabase
      .from("contact_messages")
      .insert([{ name: cleanName, email: cleanEmail, message: cleanMessage }]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save message. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}