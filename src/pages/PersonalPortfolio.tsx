"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import Navbar from "@/components/Navbar";

// ─── DATA ───────────────────────────────────────────────
const skills = [
  { label: "Flutter / Dart", angle: 0 },
  { label: "React Native", angle: 51 },
  { label: "Next.js / React", angle: 102 },
  { label: "Node.js / Express", angle: 153 },
  { label: "FastAPI", angle: 204 },
  { label: "Supabase", angle: 255 },
  { label: "Agora RTC", angle: 306 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

// ─── HERO ───────────────────────────────────────────────
function Hero() {
  return (
        <section className="relative min-h-screen w-full overflow-hidden bg-[#F5F7F6] dark:bg-ink">
      <div className="absolute inset-y-0 left-1/2 hidden w-[85%] -translate-x-1/2 lg:block">
        <img
          src="/images/Spiderman-Main.png"
          alt="Spiderman"
          className="h-full w-full object-cover object-top select-none pointer-events-none"
          style={{
            maskImage:
              "radial-gradient(ellipse 90% 95% at 50% 40%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 95% at 50% 40%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row items-center px-6 sm:px-10 lg:px-6">
        <div className="max-w-xl lg:w-[45%] lg:-ml-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-5 flex items-center gap-2 font-mono text-xs text-[#8a0303] dark:text-accent-red"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8a0303] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8a0303]" />
            </span>
            AVAILABLE FOR PROJECTS
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-4xl font-bold leading-[1.1] text-[#0b0e13] dark:text-text sm:text-5xl lg:text-6xl"
          >
            Ahmad Abdullah
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="font-display mt-4 text-lg font-medium leading-snug text-[#374151] dark:text-text-muted sm:text-xl"
          >
            Full-stack engineer building connected mobile and web systems.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-5 max-w-md text-sm leading-relaxed text-[#6b7280] dark:text-text-dim sm:text-base"
          >
            Flutter, React Native, and Next.js apps wired to real-time backends &mdash; live video, payments, and data that stay in sync.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-8 flex flex-wrap gap-3"
          >
            
            <a  href="#projects"
              data-cursor-hover
              className="rounded-lg bg-[#0b0e13] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 dark:bg-white dark:text-ink"
            >
              View work
            </a>

            
            <a  href="#contact"
              data-cursor-hover
              className="rounded-lg border border-[#d1d5db] px-6 py-3 text-sm font-medium text-[#0b0e13] transition-colors hover:bg-gray-50 dark:border-line dark:text-text dark:hover:bg-panel"
            >
              Get in touch
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="mt-10 flex flex-wrap gap-2"
          >
            {["Flutter", "Next.js", "Supabase", "Agora RTC"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#8a0303]/30 px-3 py-1 font-mono text-xs text-[#8a0303] dark:border-accent-red/40 dark:text-accent-red"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS ───────────────────────────────────────────
function Projects() {
  return (
        <section
      id="projects"
      className="relative bg-[#F5F7F6] px-6 py-28 sm:px-10 lg:px-16 dark:bg-ink"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="mb-3 font-mono text-xs text-[#8a0303] dark:text-accent-green">
            SELECTED WORK
          </div>
          <h2 className="font-display text-3xl font-bold text-[#0b0e13] dark:text-text sm:text-4xl">
            Things I&rsquo;ve built
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ──────────────────────────────────────────────
function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gray-50 px-6 py-28 sm:px-10 lg:px-16 dark:bg-ink-soft"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 font-mono text-xs text-[#8a0303] dark:text-accent-green">
            ABOUT
          </div>
          <h2 className="font-display mb-6 text-3xl font-bold text-[#0b0e13] dark:text-text sm:text-4xl">
            Full-stack, end to end.
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#6b7280] dark:text-text-muted sm:text-base">
            I build production apps across mobile and web — Flutter and React
            Native on the client side, Node.js and FastAPI on the backend,
            Supabase for auth, storage, and real-time data.
          </p>
          <p className="text-sm leading-relaxed text-[#6b7280] dark:text-text-muted sm:text-base">
            My focus is on systems that stay in sync — live video calls,
            push notifications, payments, and real-time updates — shipped as
            complete, deployed products rather than prototypes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-line" />
          {skills.map((skill) => {
            const rad = (skill.angle * Math.PI) / 180;
            const radius = 42;
            const x = 50 + radius * Math.cos(rad);
            const y = 50 + radius * Math.sin(rad);
            return (
              <div
                key={skill.label}
                data-cursor-hover
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white px-3 py-1.5 font-mono text-[11px] text-[#0b0e13] whitespace-nowrap shadow-sm dark:border-line dark:bg-panel dark:text-accent-blue dark:shadow-none"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {skill.label}
              </div>
            );
          })}
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8a0303] dark:bg-accent-green" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONTACT ────────────────────────────────────────────
function Contact() {
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
        <section
      id="contact"
      className="relative bg-[#F5F7F6] px-6 py-28 sm:px-10 lg:px-16 dark:bg-ink"
    >
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="mb-3 font-mono text-xs text-[#8a0303] dark:text-accent-green">
            GET IN TOUCH
          </div>
          <h2 className="font-display text-3xl font-bold text-[#0b0e13] dark:text-text sm:text-4xl">
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
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#0b0e13] outline-none focus:border-[#8a0303] dark:border-line dark:bg-ink-soft dark:text-text dark:focus:border-accent-blue"
          />
          <input
            required
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#0b0e13] outline-none focus:border-[#8a0303] dark:border-line dark:bg-ink-soft dark:text-text dark:focus:border-accent-blue"
          />
          <textarea
            required
            rows={5}
            placeholder="What are you building?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#0b0e13] outline-none focus:border-[#8a0303] dark:border-line dark:bg-ink-soft dark:text-text dark:focus:border-accent-blue"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            data-cursor-hover
            className="rounded-lg bg-[#0b0e13] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-50 dark:bg-text dark:text-ink"
          >
            {status === "sending" ? "Sending..." : status === "sent" ? "Sent ✓" : "Send message"}
          </button>
          {status === "error" && (
            <p className="text-sm text-red-500 dark:text-red-400">
              Something went wrong — try again.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}

// ─── MAIN EXPORT ────────────────────────────────────────
export default function PersonalPortfolio() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Contact />
    </main>
  );
}