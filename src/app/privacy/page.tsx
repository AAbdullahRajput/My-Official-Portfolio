import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft, FiShield, FiLock, FiMail, FiDatabase, FiCheckCircle } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Privacy Policy — Ahmad Abdullah",
  description: "Transparency on how your information is handled, secured, and respected when visiting Ahmad Abdullah's portfolio.",
};

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "data-collected", label: "Data Collected" },
  { id: "usage", label: "How We Use Data" },
  { id: "storage-security", label: "Storage & Security" },
  { id: "third-parties", label: "Third-Party Services" },
  { id: "cookies", label: "Cookies & Local Storage" },
  { id: "your-rights", label: "Your Rights" },
  { id: "contact", label: "Contact Me" },
];

const HIGHLIGHTS = [
  {
    icon: <FiShield className="h-5 w-5 text-[#8a0303] dark:text-[#f2a93b]" />,
    title: "No Ads or Tracking",
    desc: "I do not sell your data, use tracking pixels, or run advertising trackers on this site.",
  },
  {
    icon: <FiMail className="h-5 w-5 text-[#8a0303] dark:text-[#f2a93b]" />,
    title: "Direct Inquiries Only",
    desc: "Information submitted through the contact form is solely used to respond to your project or inquiry.",
  },
  {
    icon: <FiLock className="h-5 w-5 text-[#8a0303] dark:text-[#f2a93b]" />,
    title: "Built-in Security",
    desc: "Rate limiting, automated bot honeypots, input sanitization, and encrypted Supabase storage.",
  },
  {
    icon: <FiDatabase className="h-5 w-5 text-[#8a0303] dark:text-[#f2a93b]" />,
    title: "You Own Your Data",
    desc: "You can request immediate export or total deletion of your submitted messages at any time.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#0b0e13] transition-colors duration-300 dark:bg-[#0b0e13] dark:text-[#f1f2f4]">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(138, 3, 3, 0.08) 0%, transparent 40%), radial-gradient(circle at 85% 75%, rgba(242, 169, 59, 0.06) 0%, transparent 45%)",
        }}
      />

      {/* Header bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-[#F5F7F6]/85 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#0b0e13]/85">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            data-cursor-hover
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 font-mono text-xs font-medium text-[#0b0e13] transition-all hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#f1f2f4] dark:hover:border-[#f2a93b]/40 dark:hover:text-[#f2a93b]"
          >
            <FiArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Portfolio
          </Link>

          <span className="font-mono text-xs text-[#6b7280] dark:text-[#6c7688]">
            Last Updated: <span className="font-semibold text-[#0b0e13] dark:text-[#f1f2f4]">October 2026</span>
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {/* Title area */}
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#8a0303]/20 bg-[#8a0303]/5 px-3 py-1 font-mono text-[11px] font-semibold text-[#8a0303] dark:border-[#f2a93b]/30 dark:bg-[#f2a93b]/10 dark:text-[#f2a93b]">
            <FiShield className="h-3.5 w-3.5" />
            LEGAL & PRIVACY TRANSPARENCY
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#0b0e13] sm:text-5xl dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#4b5563] sm:text-lg dark:text-[#9aa4b5]">
            I believe privacy should be simple, honest, and free of legal jargon. This page outlines what little data is collected when you visit or get in touch, how it is safeguarded, and how you retain total control.
          </p>
        </div>

        {/* Highlights grid */}
        <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HIGHLIGHTS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm transition-all hover:border-[#8a0303]/30 dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-[#f2a93b]/25"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/[0.06]">
                {item.icon}
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-[#0b0e13] dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#6b7280] dark:text-[#9aa4b5]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Table of Contents bar */}
        <div className="mb-12 rounded-2xl border border-gray-200/80 bg-white/70 p-4 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
          <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#6b7280] dark:text-[#6c7688]">
            Quick Navigation
          </div>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                data-cursor-hover
                className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-xs text-[#374151] transition-colors hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#9aa4b5] dark:hover:border-[#f2a93b]/40 dark:hover:text-[#f2a93b]"
              >
                {sec.label}
              </a>
            ))}
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-10 text-sm leading-relaxed text-[#374151] dark:text-[#9aa4b5]">
          {/* Section: Overview */}
          <section id="overview" className="scroll-mt-24 rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <h2 className="font-display text-2xl font-bold text-[#0b0e13] dark:text-white">
              1. Overview & Data Controller
            </h2>
            <p className="mt-3">
              This portfolio (<span className="font-mono text-xs text-[#8a0303] dark:text-[#f2a93b]">ahmadabdullah.dev</span> / local instance) is operated by <strong className="text-[#0b0e13] dark:text-white">Ahmad Abdullah</strong>, a full-stack mobile & web developer based in Islamabad, Pakistan.
            </p>
            <p className="mt-2">
              For any questions or privacy inquiries regarding this site or your data, you can reach me directly at:{" "}
              <a
                href="mailto:ahmadabdullah4972@gmail.com"
                data-cursor-hover
                className="font-mono font-medium text-[#8a0303] underline decoration-[#8a0303]/40 underline-offset-4 hover:decoration-[#8a0303] dark:text-[#f2a93b] dark:decoration-[#f2a93b]/40 dark:hover:decoration-[#f2a93b]"
              >
                ahmadabdullah4972@gmail.com
              </a>.
            </p>
          </section>

          {/* Section: Data Collected */}
          <section id="data-collected" className="scroll-mt-24 rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <h2 className="font-display text-2xl font-bold text-[#0b0e13] dark:text-white">
              2. Information I Collect
            </h2>
            <p className="mt-3">
              I only collect personal information that you deliberately provide, along with minimal automated telemetry strictly required to prevent server abuse:
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-white/[0.04] dark:bg-white/[0.02]">
                <h4 className="font-semibold text-[#0b0e13] dark:text-white">
                  A. Contact Form Information
                </h4>
                <p className="mt-1 text-xs">
                  When you submit a message through the contact form, I collect your:
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
                  <li><strong>Name:</strong> To address you properly in my reply.</li>
                  <li><strong>Email Address:</strong> To deliver my response directly to your inbox.</li>
                  <li><strong>Message Body:</strong> The details, ideas, or questions you choose to share.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-white/[0.04] dark:bg-white/[0.02]">
                <h4 className="font-semibold text-[#0b0e13] dark:text-white">
                  B. Security & Rate-Limiting Telemetry
                </h4>
                <p className="mt-1 text-xs">
                  To prevent malicious spam and automated Denial-of-Service (DoS) abuse on the contact API, request IP addresses are evaluated in memory against a 10-minute rate limit window (maximum 5 submissions per window). These records are held in temporary server memory and purged automatically.
                </p>
              </div>
            </div>
          </section>

          {/* Section: How Data Is Used */}
          <section id="usage" className="scroll-mt-24 rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <h2 className="font-display text-2xl font-bold text-[#0b0e13] dark:text-white">
              3. How I Use Your Information
            </h2>
            <p className="mt-3">
              Your data is exclusively used for the following operational purposes:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#8a0303] dark:text-[#f2a93b]" />
                <span><strong>Direct Communication:</strong> Replying to your freelance, career, or collaborative project inquiries.</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#8a0303] dark:text-[#f2a93b]" />
                <span><strong>Abuse Prevention:</strong> Protecting web services against bots and repetitive automated spam.</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#8a0303] dark:text-[#f2a93b]" />
                <span><strong>Never Sold or Shared:</strong> I do not sell, rent, license, or monetize your contact details to any third-party marketing companies.</span>
              </li>
            </ul>
          </section>

          {/* Section: Storage & Security */}
          <section id="storage-security" className="scroll-mt-24 rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <h2 className="font-display text-2xl font-bold text-[#0b0e13] dark:text-white">
              4. Storage & Security Safeguards
            </h2>
            <p className="mt-3">
              I implement multi-layered defenses to keep communication secure:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs">
              <li><strong>Database Encryption:</strong> Contact submissions are stored in an encrypted PostgreSQL instance managed by Supabase, protected by Row Level Security (RLS) policies.</li>
              <li><strong>Honeypot Trap:</strong> An invisible honeypot field captures automated bot submissions and discards them before processing.</li>
              <li><strong>Strict HTTP Security Headers:</strong> Transport Layer Security (HSTS), Content-Type sniffing protection (X-Content-Type-Options: nosniff), frame protection (X-Frame-Options: DENY), and Cross-Origin isolation are enforced.</li>
              <li><strong>Sanitization:</strong> Input fields strip angle brackets and null bytes to prevent injection exploits.</li>
            </ul>
          </section>

          {/* Section: Third-Party Services */}
          <section id="third-parties" className="scroll-mt-24 rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <h2 className="font-display text-2xl font-bold text-[#0b0e13] dark:text-white">
              5. Third-Party Infrastructure
            </h2>
            <p className="mt-3">
              This portfolio integrates trusted infrastructure providers for hosting and database features:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3.5 dark:border-white/[0.04] dark:bg-white/[0.02]">
                <strong className="block text-xs font-semibold text-[#0b0e13] dark:text-white">Supabase</strong>
                <span className="text-[11px] text-[#6b7280] dark:text-[#6c7688]">Stores contact form submissions with enterprise-grade encryption and security.</span>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3.5 dark:border-white/[0.04] dark:bg-white/[0.02]">
                <strong className="block text-xs font-semibold text-[#0b0e13] dark:text-white">Vercel / Cloud Infrastructure</strong>
                <span className="text-[11px] text-[#6b7280] dark:text-[#6c7688]">Next.js hosting with edge caching, automated SSL, and DDoS mitigation.</span>
              </div>
            </div>
          </section>

          {/* Section: Cookies & Local Storage */}
          <section id="cookies" className="scroll-mt-24 rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <h2 className="font-display text-2xl font-bold text-[#0b0e13] dark:text-white">
              6. Cookies & Local Storage
            </h2>
            <p className="mt-3">
              This site does not use invasive advertising or tracking cookies. Only benign client-side <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">localStorage</code> keys are used to preserve your preferences:
            </p>
            <ul className="mt-3 space-y-1.5 text-xs">
              <li><strong className="font-mono text-[#8a0303] dark:text-[#f2a93b]">theme:</strong> Remembers your chosen Dark or Light mode appearance across visits.</li>
              <li><strong className="font-mono text-[#8a0303] dark:text-[#f2a93b]">gramo_dismissed:</strong> Remembers whether you previously closed the ambient audio widget so it does not intrude again.</li>
            </ul>
          </section>

          {/* Section: Your Rights */}
          <section id="your-rights" className="scroll-mt-24 rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <h2 className="font-display text-2xl font-bold text-[#0b0e13] dark:text-white">
              7. Your Rights (GDPR & Global Standards)
            </h2>
            <p className="mt-3">
              Regardless of where you reside, you possess complete authority over your personal information:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs">
              <li><strong>Right of Access:</strong> You may request a copy of any message history stored under your email address.</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request permanent deletion of your messages from my database at any time.</li>
              <li><strong>Right to Rectification:</strong> You may update or correct any information you previously submitted.</li>
            </ul>
            <p className="mt-3 text-xs">
              To exercise any of these rights, send an email to <a href="mailto:ahmadabdullah4972@gmail.com" className="font-mono text-[#8a0303] underline dark:text-[#f2a93b]">ahmadabdullah4972@gmail.com</a> with the subject &quot;Data Privacy Request&quot;, and your inquiry will be resolved within 48 hours.
            </p>
          </section>

          {/* Section: Contact */}
          <section id="contact" className="scroll-mt-24 rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <h2 className="font-display text-2xl font-bold text-[#0b0e13] dark:text-white">
              8. Contact & Questions
            </h2>
            <p className="mt-3">
              If you have any questions or suggestions regarding this privacy policy, feel free to reach out directly:
            </p>
            <div className="mt-4 flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50/80 p-4 font-mono text-xs dark:border-white/[0.04] dark:bg-white/[0.02]">
              <div><strong>Name:</strong> Ahmad Abdullah</div>
              <div><strong>Role:</strong> Full-Stack Developer</div>
              <div><strong>Location:</strong> Islamabad, Pakistan</div>
              <div>
                <strong>Direct Email:</strong>{" "}
                <a href="mailto:ahmadabdullah4972@gmail.com" className="text-[#8a0303] underline dark:text-[#f2a93b]">
                  ahmadabdullah4972@gmail.com
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                data-cursor-hover
                className="inline-flex items-center gap-2 rounded-full bg-[#0b0e13] px-5 py-2.5 font-mono text-xs font-semibold text-white transition-all hover:bg-[#8a0303] dark:bg-white dark:text-[#0b0e13] dark:hover:bg-[#f2a93b]"
              >
                <FiArrowLeft className="h-3.5 w-3.5" />
                Return to Portfolio
              </Link>
              <Link
                href="/#contact"
                data-cursor-hover
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-transparent px-5 py-2.5 font-mono text-xs font-semibold text-[#0b0e13] transition-colors hover:border-[#8a0303] hover:text-[#8a0303] dark:border-white/20 dark:text-white dark:hover:border-[#f2a93b] dark:hover:text-[#f2a93b]"
              >
                Send a Message
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/80 bg-white/60 py-8 dark:border-white/[0.06] dark:bg-[#0b0e13]/60">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-xs text-[#6b7280] dark:text-[#6c7688]">
            &copy; {new Date().getFullYear()} Ahmad Abdullah. All rights reserved.
          </p>
          <div className="flex items-center gap-4 font-mono text-xs text-[#6b7280] dark:text-[#6c7688]">
            <Link href="/" className="hover:text-[#8a0303] dark:hover:text-[#f2a93b]">
              Home
            </Link>
            <span>&middot;</span>
            <Link href="/#projects" className="hover:text-[#8a0303] dark:hover:text-[#f2a93b]">
              Projects
            </Link>
            <span>&middot;</span>
            <Link href="/#contact" className="hover:text-[#8a0303] dark:hover:text-[#f2a93b]">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

