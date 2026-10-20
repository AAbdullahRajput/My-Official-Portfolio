"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiGithub, FiMail } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

const LINKEDIN_URL = "https://www.linkedin.com/in/ahmad-a-972497411";

export default function Footer() {
  const year = new Date().getFullYear();

  const exploreLinks = [
    { label: "Work", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Career", href: "#career" },
    { label: "Contact", href: "#contact" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        // If not on home page, normal link href `/${href}` will navigate to home page anchor
      }
    }
  };

  const handleSignatureClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative border-t border-gray-200 bg-[#F5F7F6] dark:border-line dark:bg-ink">
      <div className="grid grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:pl-20 xl:pl-32 lg:pr-20 xl:pr-32">
        {/* Brand */}
        <div className="sm:col-span-2 lg:pl-0">
          <motion.div
            className="relative inline-block"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{
              clipPath: [
                "inset(0 100% 0 0)",
                "inset(0 78% 0 0)",
                "inset(0 78% 0 0)",
                "inset(0 52% 0 0)",
                "inset(0 52% 0 0)",
                "inset(0 24% 0 0)",
                "inset(0 24% 0 0)",
                "inset(0 0% 0 0)",
              ],
              transition: {
                duration: 2.4,
                times: [0, 0.22, 0.28, 0.5, 0.56, 0.78, 0.84, 1],
                ease: "easeInOut",
              },
            }}
            whileHover={{
              clipPath: [
                "inset(0 100% 0 0)",
                "inset(0 78% 0 0)",
                "inset(0 78% 0 0)",
                "inset(0 52% 0 0)",
                "inset(0 52% 0 0)",
                "inset(0 24% 0 0)",
                "inset(0 24% 0 0)",
                "inset(0 0% 0 0)",
              ],
              transition: {
                duration: 1.4,
                times: [0, 0.22, 0.28, 0.5, 0.56, 0.78, 0.84, 1],
                ease: "easeInOut",
              },
            }}
            viewport={{ once: false, amount: 0, margin: "0px 0px -100px 0px" }}
          >
            <button
              type="button"
              data-cursor-hover
              onClick={handleSignatureClick}
              className="block cursor-pointer focus:outline-none"
              aria-label="Scroll to top or return home"
            >
              <div className="h-16 w-60 sm:w-72 max-w-full overflow-hidden">
                <img
                  src="/images/signature.svg"
                  alt="Ahmad Abdullah signature"
                  className="h-full w-full object-contain dark:invert select-none"
                />
              </div>
            </button>
          </motion.div>
          <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
            Full-Stack Developer
          </p>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-[#6b7280] dark:text-text-muted">
            Building cross-platform mobile &amp; web systems &mdash; Flutter, React Native, and Next.js wired to real-time backends.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://github.com/AAbdullahRajput"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#6b7280] transition-colors hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:text-text-dim dark:hover:border-accent-green/30 dark:hover:text-accent-green"
              aria-label="GitHub Profile"
            >
              <FiGithub size={15} />
            </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#6b7280] transition-colors hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:text-text-dim dark:hover:border-accent-green/30 dark:hover:text-accent-green"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin size={15} />
            </a>

            <a
              href="mailto:ahmadabdullah4972@gmail.com"
              data-cursor-hover
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#6b7280] transition-colors hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:text-text-dim dark:hover:border-accent-green/30 dark:hover:text-accent-green"
              aria-label="Email Ahmad Abdullah"
            >
              <FiMail size={15} />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[#0b0e13] dark:text-text">
            Explore
          </div>
          <ul className="space-y-2.5">
            {exploreLinks.map((link) => {
              const destination = link.href.startsWith("#") ? `/${link.href}` : link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={destination}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    data-cursor-hover
                    className="text-[13px] text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Get in touch */}
        <div>
          <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[#0b0e13] dark:text-text">
            Get in touch
          </div>

          <a
            href="mailto:ahmadabdullah4972@gmail.com"
            data-cursor-hover
            className="block text-[13px] text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
          >
            ahmadabdullah4972@gmail.com
          </a>
          <p className="mt-2 text-[13px] text-[#6b7280] dark:text-text-muted">
            Islamabad, Pakistan
          </p>

          <Link
            href="/#contact"
            onClick={(e) => handleLinkClick(e, "#contact")}
            data-cursor-hover
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#0b0e13] px-4 py-2 font-mono text-[11px] font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[#8a0303] dark:bg-white/10 dark:text-white dark:hover:bg-accent-green dark:hover:text-[#0b0e13]"
          >
            Start a project
            <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-line">
        <div className="flex flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row sm:px-10 lg:pl-20 xl:pl-32 lg:pr-20 xl:pr-32">
          <p className="font-mono text-xs text-[#6b7280] dark:text-text-dim">
            &copy; {year} Ahmad Abdullah. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              data-cursor-hover
              className="font-mono text-xs text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-dim dark:hover:text-accent-green"
            >
              Privacy Policy
            </Link>
            <span className="text-[#6b7280]/40 dark:text-text-dim/40">&middot;</span>
            <p className="font-mono text-xs text-[#6b7280] dark:text-text-dim">
              Islamabad, PK &middot; Available for freelance
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

