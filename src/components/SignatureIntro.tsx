"use client";

import { motion } from "framer-motion";

export default function SignatureIntro({ onComplete }: { onComplete?: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0b0e13]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative w-72 sm:w-96">
        {/* the signature itself, revealed via animated mask */}
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={onComplete}
          className="relative"
        >
          <img
            src="/images/signature.svg"
            alt="Signature"
            className="w-full h-auto invert" // invert makes the black trace render white on your dark bg
          />
        </motion.div>

        {/* traveling glow "pen tip" riding the reveal edge */}
        <motion.div
          initial={{ left: "0%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
          className="absolute top-0 h-full w-6 -translate-x-1/2 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)",
            filter: "blur(4px)",
          }}
        />
      </div>
    </motion.div>
  );
}