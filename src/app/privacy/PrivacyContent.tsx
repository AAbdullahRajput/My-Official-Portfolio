"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import {
  FiShield,
  FiLock,
  FiMail,
  FiDatabase,
  FiCheckCircle,
  FiXCircle,
  FiServer,
  FiClock,
  FiArrowLeft,
  FiArrowUpRight,
  FiTrash2,
  FiEye,
  FiChevronRight,
  FiKey,
} from "react-icons/fi";
import { SiSupabase, SiRedis, SiVercel, SiNextdotjs } from "react-icons/si";

interface SectionItem {
  id: string;
  title: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const SECTIONS: SectionItem[] = [
  {
    id: "overview",
    title: "1. Overview & Data Controller",
    shortLabel: "Overview",
    icon: <FiShield className="h-4 w-4" />,
  },
  {
    id: "data-collected",
    title: "2. Information We Collect",
    shortLabel: "Data Collected",
    icon: <FiDatabase className="h-4 w-4" />,
  },
  {
    id: "usage",
    title: "3. How Your Data Is Used",
    shortLabel: "Data Usage",
    icon: <FiCheckCircle className="h-4 w-4" />,
  },
  {
    id: "security",
    title: "4. Storage & Security Architecture",
    shortLabel: "Security",
    icon: <FiLock className="h-4 w-4" />,
  },
  {
    id: "third-parties",
    title: "5. Third-Party Infrastructure",
    shortLabel: "Third Parties",
    icon: <FiServer className="h-4 w-4" />,
  },
  {
    id: "cookies",
    title: "6. Cookies & Local Storage",
    shortLabel: "Cookies",
    icon: <FiEye className="h-4 w-4" />,
  },
  {
    id: "your-rights",
    title: "7. Your Legal Rights & Deletion",
    shortLabel: "Your Rights",
    icon: <FiKey className="h-4 w-4" />,
  },
  {
    id: "contact",
    title: "8. Contact & Legal Inquiries",
    shortLabel: "Contact",
    icon: <FiMail className="h-4 w-4" />,
  },
];

const TRUST_METRICS = [
  {
    label: "Zero Trackers",
    sub: "No ad pixels or marketing analytics",
    icon: <FiXCircle className="h-5 w-5 text-[#8a0303] dark:text-[#f2a93b]" />,
  },
  {
    label: "Encrypted Storage",
    sub: "TLS 1.3 & Supabase Row Level Security",
    icon: <FiLock className="h-5 w-5 text-[#8a0303] dark:text-[#f2a93b]" />,
  },
  {
    label: "Bot & Spam Protected",
    sub: "Upstash Redis in-memory rate limiting",
    icon: <FiShield className="h-5 w-5 text-[#8a0303] dark:text-[#f2a93b]" />,
  },
  {
    label: "100% User Control",
    sub: "Instant data export or deletion upon request",
    icon: <FiTrash2 className="h-5 w-5 text-[#8a0303] dark:text-[#f2a93b]" />,
  },
];

export default function PrivacyContent() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Scroll progress for reading bar & parallax
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax ambient glows
  const ambientY1 = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const ambientY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // Track active section and reading percentage
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollPercent(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // ScrollSpy for sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F5F7F6] text-[#0b0e13] selection:bg-[#8a0303]/15 selection:text-[#8a0303] dark:bg-[#0b0e13] dark:text-[#f1f2f4] dark:selection:bg-[#f2a93b]/20 dark:selection:text-[#f2a93b]">
      {/* ── Fixed Reading Progress Bar ── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 z-[120] h-1 origin-left bg-gradient-to-r from-[#8a0303] via-[#e53e3e] to-[#f2a93b] shadow-[0_0_12px_rgba(229,62,62,0.5)]"
      />

      {/* ── Parallax Ambient Background Mesh ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          style={{ y: ambientY1 }}
          className="absolute -top-[15%] -left-[10%] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-[#8a0303]/10 to-transparent blur-3xl dark:from-[#8a0303]/15"
        />
        <motion.div
          style={{ y: ambientY2 }}
          className="absolute top-[40%] -right-[15%] h-[650px] w-[650px] rounded-full bg-gradient-to-bl from-[#f2a93b]/10 to-transparent blur-3xl dark:from-[#f2a93b]/12"
        />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ── Floating Navbar (connected to portfolio) ── */}
      <Navbar />

      {/* ── Main Content Container ── */}
      <div className="relative z-10 pt-28 sm:pt-36 lg:pt-40">
        {/* Hero Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {/* Breadcrumb & Meta */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-[#6b7280] dark:text-[#9aa4b5]">
              <Link
                href="/"
                data-cursor-hover
                className="inline-flex items-center gap-1.5 transition-colors hover:text-[#8a0303] dark:hover:text-[#f2a93b]"
              >
                <FiArrowLeft className="h-3.5 w-3.5" />
                Portfolio
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#8a0303] dark:text-[#f2a93b]">
                Privacy Policy
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3.5 py-1 font-mono text-[11px] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#6b7280] dark:text-[#9aa4b5]">Last Updated:</span>
              <span className="font-semibold text-[#0b0e13] dark:text-white">October 2026</span>
            </div>
          </div>

          {/* Hero Header */}
          <div className="mb-12 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#8a0303]/20 bg-[#8a0303]/5 px-3.5 py-1 font-mono text-[11px] font-semibold text-[#8a0303] dark:border-[#f2a93b]/30 dark:bg-[#f2a93b]/10 dark:text-[#f2a93b]">
              <FiShield className="h-3.5 w-3.5" />
              TRANSPARENCY & DATA SOVEREIGNTY
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#0b0e13] sm:text-5xl lg:text-6xl dark:text-white">
              Privacy Policy
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#4b5563] sm:text-lg dark:text-[#9aa4b5]">
              I value your privacy as much as my own. This portfolio collects only the absolute minimum information required to respond to your project requests &mdash; no invasive tracking pixels, no advertising beacons, and no hidden marketing profiles.
            </p>
          </div>

          {/* Trust Metrics Cards */}
          <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_METRICS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#8a0303]/30 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-[#f2a93b]/30"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#8a0303]/5 dark:bg-[#f2a93b]/10">
                  {item.icon}
                </div>
                <h3 className="font-sans text-sm font-bold text-[#0b0e13] dark:text-white">
                  {item.label}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#6b7280] dark:text-[#9aa4b5]">
                  {item.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Mobile/Tablet Sticky Quick Navigation Bar ── */}
        <div
          ref={mobileNavRef}
          aria-label="Privacy sections navigation"
          className="sticky top-16 z-30 mb-8 border-y border-gray-200/80 bg-[#F5F7F6]/90 py-2.5 backdrop-blur-md lg:hidden dark:border-white/[0.08] dark:bg-[#0b0e13]/90"
        >
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 sm:px-6">
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[#6b7280] dark:text-[#9aa4b5]">
              Jump to:
            </span>
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  data-cursor-hover
                  className={`shrink-0 rounded-full px-3 py-1 font-mono text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#8a0303] text-white shadow-sm dark:bg-[#f2a93b] dark:text-[#0b0e13]"
                      : "border border-gray-200 bg-white text-[#4b5563] hover:border-gray-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9aa4b5]"
                  }`}
                >
                  {sec.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Desktop Two-Column Layout ── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
            {/* Desktop Sticky Table of Contents Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                {/* Table of Contents Box */}
                <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.02]">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0b0e13] dark:text-white">
                      Table of Contents
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                      <FiClock className="h-3 w-3" /> 4 min read
                    </span>
                  </div>

                  {/* Progress tracker */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                      <span>Reading Progress</span>
                      <span className="font-semibold text-[#8a0303] dark:text-[#f2a93b]">
                        {scrollPercent}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8a0303] to-[#f2a93b] transition-all duration-150"
                        style={{ width: `${scrollPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Nav Links */}
                  <nav className="space-y-1">
                    {SECTIONS.map((sec) => {
                      const isActive = activeSection === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => scrollTo(sec.id)}
                          data-cursor-hover
                          className={`group relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-sans text-xs font-medium transition-all ${
                            isActive
                              ? "bg-[#8a0303]/10 text-[#8a0303] font-semibold dark:bg-[#f2a93b]/15 dark:text-[#f2a93b]"
                              : "text-[#4b5563] hover:bg-gray-100/70 hover:text-[#0b0e13] dark:text-[#9aa4b5] dark:hover:bg-white/[0.04] dark:hover:text-white"
                          }`}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="activeSidebarIndicator"
                              className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#8a0303] dark:bg-[#f2a93b]"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <span
                            className={`shrink-0 ${
                              isActive
                                ? "text-[#8a0303] dark:text-[#f2a93b]"
                                : "text-[#9ca3af] group-hover:text-[#0b0e13] dark:text-white/40 dark:group-hover:text-white"
                            }`}
                          >
                            {sec.icon}
                          </span>
                          <span className="truncate">{sec.shortLabel}</span>
                          {isActive && (
                            <FiChevronRight className="ml-auto h-3 w-3 shrink-0 text-[#8a0303] dark:text-[#f2a93b]" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Direct Help / Contact Widget */}
                <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.02]">
                  <h4 className="font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                    Have Privacy Questions?
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#6b7280] dark:text-[#9aa4b5]">
                    Reach out directly for data requests or clarifications.
                  </p>
                  <a
                    href="mailto:ahmadabdullah4972@gmail.com"
                    data-cursor-hover
                    className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#8a0303] hover:underline dark:text-[#f2a93b]"
                  >
                    ahmadabdullah4972@gmail.com
                    <FiArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </aside>

            {/* ── Main Policy Content Sections ── */}
            <main className="space-y-12 pb-24 text-sm leading-relaxed text-[#374151] dark:text-[#9aa4b5]">
              {/* 1. Overview */}
              <motion.section
                id="overview"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45 }}
                className="scroll-mt-32 rounded-3xl border border-gray-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8a0303]/10 font-mono text-xs font-bold text-[#8a0303] dark:bg-[#f2a93b]/15 dark:text-[#f2a93b]">
                    01
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8a0303] dark:text-[#f2a93b]">
                    Introduction
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b0e13] sm:text-3xl dark:text-white">
                  1. Overview & Data Controller
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    This personal portfolio (<span className="font-mono text-xs font-semibold text-[#8a0303] dark:text-[#f2a93b]">ahmadabdullah.dev</span>) is designed, owned, and maintained by{" "}
                    <strong className="text-[#0b0e13] dark:text-white">Ahmad Abdullah</strong>, an independent Full-Stack Mobile & Web Developer located in Islamabad, Pakistan.
                  </p>
                  <p>
                    The purpose of this website is to showcase selected software engineering works, mobile and web applications, open-source contributions, technical skill sets, and to provide a secure communication channel for potential clients, collaborators, and employers.
                  </p>
                  <p>
                    Unlike commercial platforms, this portfolio does not monetize user data. There are no sponsored ad networks, no behavioral tracking cookies, and no data syndication to third-party brokers.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-gray-200/70 bg-gray-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.03]">
                  <div className="flex items-start gap-3">
                    <FiShield className="mt-0.5 h-5 w-5 shrink-0 text-[#8a0303] dark:text-[#f2a93b]" />
                    <div>
                      <p className="font-sans text-xs font-semibold text-[#0b0e13] dark:text-white">
                        Controller Contact Details
                      </p>
                      <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                        Ahmad Abdullah &middot; Islamabad, Federal Capital, Pakistan &middot;{" "}
                        <a
                          href="mailto:ahmadabdullah4972@gmail.com"
                          className="font-mono font-medium text-[#8a0303] hover:underline dark:text-[#f2a93b]"
                        >
                          ahmadabdullah4972@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* 2. Information We Collect */}
              <motion.section
                id="data-collected"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45 }}
                className="scroll-mt-32 rounded-3xl border border-gray-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8a0303]/10 font-mono text-xs font-bold text-[#8a0303] dark:bg-[#f2a93b]/15 dark:text-[#f2a93b]">
                    02
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8a0303] dark:text-[#f2a93b]">
                    Data Breakdown
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b0e13] sm:text-3xl dark:text-white">
                  2. Information We Collect
                </h2>
                <p className="mt-3">
                  I believe in strict data minimization. I only collect information that you knowingly submit when contacting me.
                </p>

                {/* Comparison Grid */}
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* What We Collect */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5 dark:border-emerald-500/30 dark:bg-emerald-500/[0.05]">
                    <div className="mb-3 flex items-center gap-2">
                      <FiCheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        What You Provide Directly
                      </h3>
                    </div>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">&bull;</span>
                        <span><strong className="text-[#0b0e13] dark:text-white">Full Name:</strong> To address you professionally in correspondence.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">&bull;</span>
                        <span><strong className="text-[#0b0e13] dark:text-white">Email Address:</strong> To reply to your inquiry or project request.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">&bull;</span>
                        <span><strong className="text-[#0b0e13] dark:text-white">Project Scope & Message:</strong> Details you provide regarding your product, deliverables, or timeline.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">&bull;</span>
                        <span><strong className="text-[#0b0e13] dark:text-white">Submission Timestamp:</strong> Recorded for rate limiting and response ordering.</span>
                      </li>
                    </ul>
                  </div>

                  {/* What We NEVER Collect */}
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-5 dark:border-rose-500/30 dark:bg-rose-500/[0.05]">
                    <div className="mb-3 flex items-center gap-2">
                      <FiXCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                        What We NEVER Collect
                      </h3>
                    </div>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">&times;</span>
                        <span><strong className="text-[#0b0e13] dark:text-white">Payment or Banking Info:</strong> No card numbers, bank accounts, or financial data.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">&times;</span>
                        <span><strong className="text-[#0b0e13] dark:text-white">Passwords or Credentials:</strong> No account signup is required to view this site.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">&times;</span>
                        <span><strong className="text-[#0b0e13] dark:text-white">Advertising Tracking:</strong> No Facebook Pixel, Google Tag Manager, or TikTok trackers.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">&times;</span>
                        <span><strong className="text-[#0b0e13] dark:text-white">Device Fingerprinting:</strong> No invasive canvas or hardware profiling.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* 3. How We Use Data */}
              <motion.section
                id="usage"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45 }}
                className="scroll-mt-32 rounded-3xl border border-gray-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8a0303]/10 font-mono text-xs font-bold text-[#8a0303] dark:bg-[#f2a93b]/15 dark:text-[#f2a93b]">
                    03
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8a0303] dark:text-[#f2a93b]">
                    Purpose & Legal Basis
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b0e13] sm:text-3xl dark:text-white">
                  3. How Your Data Is Used
                </h2>
                <p className="mt-3">
                  Under the General Data Protection Regulation (GDPR) Article 6(1)(b) & (f), the processing of your message data relies on <strong className="text-[#0b0e13] dark:text-white">Contractual Steps</strong> (taking steps at your request prior to entering into a contract) and <strong className="text-[#0b0e13] dark:text-white">Legitimate Interests</strong> (responding to your direct inquiries).
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3 rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8a0303]/10 text-[#8a0303] dark:bg-[#f2a93b]/15 dark:text-[#f2a93b]">
                      <FiMail className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                        Direct Inquiry Responses & Quotations
                      </h4>
                      <p className="mt-1 text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                        Your name, email address, and project brief are used solely to reply with technical insights, availability, project scopes, or to schedule a discovery discussion.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8a0303]/10 text-[#8a0303] dark:bg-[#f2a93b]/15 dark:text-[#f2a93b]">
                      <FiShield className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                        Spam Prevention & System Integrity
                      </h4>
                      <p className="mt-1 text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                        Transient IP hashes are checked against Upstash Redis in-memory token buckets to deter automated DDoS assaults and malicious contact spam.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4 text-xs dark:border-amber-500/30 dark:bg-amber-500/[0.05]">
                  <p className="font-semibold text-amber-800 dark:text-amber-300">
                    Strict Non-Monetization Pledge:
                  </p>
                  <p className="mt-1 text-[#6b7280] dark:text-[#9aa4b5]">
                    I never sell, rent, license, barter, or trade your contact details with data brokers, recruiters, marketing agencies, or any other commercial entities.
                  </p>
                </div>
              </motion.section>

              {/* 4. Storage & Security */}
              <motion.section
                id="security"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45 }}
                className="scroll-mt-32 rounded-3xl border border-gray-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8a0303]/10 font-mono text-xs font-bold text-[#8a0303] dark:bg-[#f2a93b]/15 dark:text-[#f2a93b]">
                    04
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8a0303] dark:text-[#f2a93b]">
                    Engineering Protections
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b0e13] sm:text-3xl dark:text-white">
                  4. Storage & Security Architecture
                </h2>
                <p className="mt-3">
                  As a full-stack engineer, I design security into the architecture from the very first line of code. Contact submissions are secured across every tier of the stack.
                </p>

                {/* Architecture Highlights */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-gray-200/80 bg-gray-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold text-[#0b0e13] dark:text-white">
                      <SiSupabase className="h-4 w-4 text-[#3ECF8E]" />
                      Supabase PostgreSQL
                    </div>
                    <p className="text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                      Encrypted at rest using AES-256 and protected by PostgreSQL Row Level Security (RLS) policies.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200/80 bg-gray-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold text-[#0b0e13] dark:text-white">
                      <SiRedis className="h-4 w-4 text-[#FF4438]" />
                      Upstash Token Bucket
                    </div>
                    <p className="text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                      In-memory ephemeral rate limiting to thwart automated spam without persisting permanent IP identities.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200/80 bg-gray-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold text-[#0b0e13] dark:text-white">
                      <FiLock className="h-4 w-4 text-[#8a0303] dark:text-[#f2a93b]" />
                      TLS 1.3 Transport
                    </div>
                    <p className="text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                      All network traffic is encrypted end-to-end via Transport Layer Security (TLS 1.3/HTTPS).
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-xs">
                  <p>
                    <strong className="text-[#0b0e13] dark:text-white">Data Retention:</strong> Inquiries are retained only as long as necessary to fulfill business communication (typically 90 days following inquiry resolution). You may request instant deletion at any time.
                  </p>
                </div>
              </motion.section>

              {/* 5. Third-Party Infrastructure */}
              <motion.section
                id="third-parties"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45 }}
                className="scroll-mt-32 rounded-3xl border border-gray-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8a0303]/10 font-mono text-xs font-bold text-[#8a0303] dark:bg-[#f2a93b]/15 dark:text-[#f2a93b]">
                    05
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8a0303] dark:text-[#f2a93b]">
                    Ecosystem & Sub-processors
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b0e13] sm:text-3xl dark:text-white">
                  5. Third-Party Infrastructure
                </h2>
                <p className="mt-3">
                  This portfolio utilizes battle-tested, security-certified cloud providers to deliver high availability and fast edge performance:
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <SiVercel className="h-5 w-5 text-black dark:text-white shrink-0" />
                      <div>
                        <h4 className="font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                          Vercel Inc. (Edge Hosting & CDN)
                        </h4>
                        <p className="text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                          Hosts frontend assets and edge serverless routes. SOC 2 Type II certified.
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                      San Francisco, USA
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <SiSupabase className="h-5 w-5 text-[#3ECF8E] shrink-0" />
                      <div>
                        <h4 className="font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                          Supabase Inc. (Database & Auth Infrastructure)
                        </h4>
                        <p className="text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                          PostgreSQL database storing contact form entries with strict RLS and AES encryption.
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                      Singapore / EU / US
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <SiRedis className="h-5 w-5 text-[#FF4438] shrink-0" />
                      <div>
                        <h4 className="font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                          Upstash Inc. (Serverless Redis)
                        </h4>
                        <p className="text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                          In-memory rate limiting cache for DDoS mitigation without permanent identity retention.
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                      California, USA
                    </span>
                  </div>
                </div>
              </motion.section>

              {/* 6. Cookies & Local Storage */}
              <motion.section
                id="cookies"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45 }}
                className="scroll-mt-32 rounded-3xl border border-gray-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8a0303]/10 font-mono text-xs font-bold text-[#8a0303] dark:bg-[#f2a93b]/15 dark:text-[#f2a93b]">
                    06
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8a0303] dark:text-[#f2a93b]">
                    Client Storage
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b0e13] sm:text-3xl dark:text-white">
                  6. Cookies & Local Storage
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    This portfolio operates in full compliance with the EU ePrivacy Directive (Cookie Law). You will notice that there is <strong className="text-[#0b0e13] dark:text-white">no irritating cookie consent banner</strong> &mdash; that is because this site does not deploy any non-essential or tracking cookies whatsoever.
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <h4 className="font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                    What Gets Saved in Your Browser:
                  </h4>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
                      <div>
                        <span className="font-mono font-semibold text-[#8a0303] dark:text-[#f2a93b]">
                          theme (localStorage)
                        </span>
                        <p className="mt-0.5 text-[11px] text-[#6b7280] dark:text-[#9aa4b5]">
                          Remembers your light or dark mode visual preference across page reloads.
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Essential UI
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
                      <div>
                        <span className="font-mono font-semibold text-[#8a0303] dark:text-[#f2a93b]">
                          Marketing Cookies
                        </span>
                        <p className="mt-0.5 text-[11px] text-[#6b7280] dark:text-[#9aa4b5]">
                          No third-party cross-site cookies, advertising IDs, or tracking beacons.
                        </p>
                      </div>
                      <span className="rounded-full bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                        None / 0
                      </span>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* 7. Your Legal Rights & Deletion */}
              <motion.section
                id="your-rights"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45 }}
                className="scroll-mt-32 rounded-3xl border border-gray-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8a0303]/10 font-mono text-xs font-bold text-[#8a0303] dark:bg-[#f2a93b]/15 dark:text-[#f2a93b]">
                    07
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8a0303] dark:text-[#f2a93b]">
                    GDPR & CCPA Rights
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b0e13] sm:text-3xl dark:text-white">
                  7. Your Legal Rights & One-Click Deletion
                </h2>
                <p className="mt-3">
                  Under the European Union GDPR, UK GDPR, and California CCPA/CPRA, you hold absolute rights over any personal information you provide:
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200/80 bg-gray-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <h4 className="font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                      Right to Access & Portability
                    </h4>
                    <p className="mt-1 text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                      Request an export of any contact message or record associated with your email address.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200/80 bg-gray-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <h4 className="font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                      Right to Erasure ("To Be Forgotten")
                    </h4>
                    <p className="mt-1 text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                      Request the prompt and permanent deletion of your messages from the Supabase database.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200/80 bg-gray-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <h4 className="font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                      Right to Rectification
                    </h4>
                    <p className="mt-1 text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                      Correct or update any outdated contact details or inquiry statements you provided.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200/80 bg-gray-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <h4 className="font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                      Right to Restrict or Object
                    </h4>
                    <p className="mt-1 text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                      Halt further communication or processing of your inquiry at any point with zero penalty.
                    </p>
                  </div>
                </div>

                {/* Instant Action Card */}
                <div className="mt-6 rounded-2xl border border-[#8a0303]/20 bg-gradient-to-br from-[#8a0303]/5 via-transparent to-[#f2a93b]/5 p-5 dark:border-[#f2a93b]/20 dark:from-[#8a0303]/10 dark:to-[#f2a93b]/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-sans text-sm font-bold text-[#0b0e13] dark:text-white">
                        Exercise Your Right to Erasure
                      </h4>
                      <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                        Send a pre-filled deletion request directly to Ahmad. Handled within 24–48 hours.
                      </p>
                    </div>

                    <a
                      href="mailto:ahmadabdullah4972@gmail.com?subject=Data%20Deletion%20Request%20-%20Ahmad%20Abdullah%20Portfolio&body=Hello%20Ahmad,%0D%0A%0D%0APlease%20permanently%20delete%20any%20contact%20form%20submissions%20and%20associated%20data%20linked%20to%20my%20email%20address.%0D%0A%0D%0AEmail:%20[Your%20Email]%0D%0AName:%20[Your%20Name]"
                      data-cursor-hover
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#8a0303] px-4 py-2.5 font-mono text-xs font-medium text-white shadow-sm transition-all hover:bg-[#6e0202] dark:bg-[#f2a93b] dark:text-[#0b0e13] dark:hover:bg-[#d8932e]"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                      Request Data Deletion
                    </a>
                  </div>
                </div>
              </motion.section>

              {/* 8. Contact & Legal Inquiries */}
              <motion.section
                id="contact"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45 }}
                className="scroll-mt-32 rounded-3xl border border-gray-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8a0303]/10 font-mono text-xs font-bold text-[#8a0303] dark:bg-[#f2a93b]/15 dark:text-[#f2a93b]">
                    08
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8a0303] dark:text-[#f2a93b]">
                    Direct Channel
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b0e13] sm:text-3xl dark:text-white">
                  8. Contact & Legal Inquiries
                </h2>
                <p className="mt-3">
                  If you have any questions about this Privacy Policy, your submitted information, or our security practices, feel free to reach out directly:
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="flex-1 rounded-2xl border border-gray-200/80 bg-gray-50/70 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6b7280] dark:text-[#9aa4b5]">
                      Primary Email
                    </span>
                    <a
                      href="mailto:ahmadabdullah4972@gmail.com"
                      data-cursor-hover
                      className="mt-2 block font-mono text-sm font-semibold text-[#8a0303] hover:underline dark:text-[#f2a93b]"
                    >
                      ahmadabdullah4972@gmail.com
                    </a>
                    <p className="mt-1 text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                      Typical response window: 12&ndash;24 hours.
                    </p>
                  </div>

                  <div className="flex-1 rounded-2xl border border-gray-200/80 bg-gray-50/70 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6b7280] dark:text-[#9aa4b5]">
                      Physical Location
                    </span>
                    <p className="mt-2 font-mono text-sm font-semibold text-[#0b0e13] dark:text-white">
                      Islamabad, Pakistan
                    </p>
                    <p className="mt-1 text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                      Timezone: PKT (UTC+5)
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/80 pt-6 dark:border-white/[0.08]">
                  <Link
                    href="/"
                    data-cursor-hover
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#4b5563] transition-colors hover:text-[#8a0303] dark:text-[#9aa4b5] dark:hover:text-[#f2a93b]"
                  >
                    <FiArrowLeft className="h-4 w-4" />
                    Back to Portfolio Home
                  </Link>

                  <Link
                    href="/#contact"
                    data-cursor-hover
                    className="inline-flex items-center gap-2 rounded-full bg-[#0b0e13] px-5 py-2.5 font-mono text-xs font-medium text-white transition-all hover:bg-[#8a0303] dark:bg-white/10 dark:hover:bg-[#f2a93b] dark:hover:text-[#0b0e13]"
                  >
                    Go to Portfolio Contact Form
                    <FiArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.section>
            </main>
          </div>
        </div>
      </div>

      {/* ── Floating Scroll-to-Top Button ── */}
      <ScrollToTop />

      {/* ── Footer (signature animation & links) ── */}
      <Footer />
    </div>
  );
}

