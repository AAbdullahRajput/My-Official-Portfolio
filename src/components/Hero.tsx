"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const NodeNetwork = dynamic(() => import("./three/NodeNetwork"), {
  ssr: false,
});

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

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <NodeNetwork />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 sm:px-10 lg:px-16">
        <div className="max-w-xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-5 flex items-center gap-2 font-mono text-xs text-accent-green"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
            </span>
            AVAILABLE FOR PROJECTS
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-4xl font-bold leading-[1.1] text-text sm:text-5xl lg:text-6xl"
          >
            Ahmad Abdullah
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="font-display mt-4 text-lg font-medium leading-snug text-text-muted sm:text-xl"
          >
            Full-stack engineer building connected mobile and web systems.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-5 max-w-md text-sm leading-relaxed text-text-dim sm:text-base"
          >
            Flutter, React Native, and Next.js apps wired to real-time
            backends — live video, payments, and data that stay in sync.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a href="#projects" data-cursor-hover className="rounded-lg bg-text px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-105">
              View work
            </a>
            <a href="#contact" data-cursor-hover className="rounded-lg border border-line px-6 py-3 text-sm font-medium text-text transition-colors hover:bg-panel">
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
              <span key={tag} className="rounded-full border border-line bg-ink-soft px-3 py-1 font-mono text-xs text-accent-blue">
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}