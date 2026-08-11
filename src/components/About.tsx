"use client";

import { motion } from "framer-motion";

const skills = [
  { label: "Flutter / Dart", angle: 0 },
  { label: "React Native", angle: 51 },
  { label: "Next.js / React", angle: 102 },
  { label: "Node.js / Express", angle: 153 },
  { label: "FastAPI", angle: 204 },
  { label: "Supabase", angle: 255 },
  { label: "Agora RTC", angle: 306 },
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-ink-soft px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 font-mono text-xs text-accent-green">ABOUT</div>
          <h2 className="font-display mb-6 text-3xl font-bold text-text sm:text-4xl">
            Full-stack, end to end.
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-text-muted sm:text-base">
            I build production apps across mobile and web — Flutter and React
            Native on the client side, Node.js and FastAPI on the backend,
            Supabase for auth, storage, and real-time data.
          </p>
          <p className="text-sm leading-relaxed text-text-muted sm:text-base">
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
          <div className="absolute inset-0 rounded-full border border-line" />
          {skills.map((skill) => {
            const rad = (skill.angle * Math.PI) / 180;
            const radius = 42;
            const x = 50 + radius * Math.cos(rad);
            const y = 50 + radius * Math.sin(rad);
            return (
              <div
                key={skill.label}
                data-cursor-hover
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-panel px-3 py-1.5 font-mono text-[11px] text-accent-blue whitespace-nowrap"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {skill.label}
              </div>
            );
          })}
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-green" />
        </motion.div>
      </div>
    </section>
  );
}