"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative bg-ink px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="mb-3 font-mono text-xs text-accent-green">GET IN TOUCH</div>
          <h2 className="font-display text-3xl font-bold text-text sm:text-4xl">
            Let&rsquo;s build something.
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-line bg-ink-soft px-4 py-3 text-sm text-text outline-none focus:border-accent-blue"
          />
          <input
            required
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-line bg-ink-soft px-4 py-3 text-sm text-text outline-none focus:border-accent-blue"
          />
          <textarea
            required
            rows={5}
            placeholder="What are you building?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="rounded-lg border border-line bg-ink-soft px-4 py-3 text-sm text-text outline-none focus:border-accent-blue"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            data-cursor-hover
            className="rounded-lg bg-text px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-105 disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : status === "sent" ? "Sent ✓" : "Send message"}
          </button>
          {status === "error" && (
            <p className="text-sm text-red-400">Something went wrong — try again.</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}