"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import PersonalPortfolio from "@/pages/PersonalPortfolio";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If splash was already seen this session or user navigated with a hash like #contact
    if (
      sessionStorage.getItem("portfolio_splash_seen") === "1" ||
      sessionStorage.getItem("splash_done") === "1" ||
      Boolean(window.location.hash)
    ) {
      setSplashDone(true);
    }
  }, []);

  // Mark splash as completed in session storage and broadcast event
  useEffect(() => {
    if (splashDone && typeof window !== "undefined") {
      sessionStorage.setItem("portfolio_splash_seen", "1");
      sessionStorage.setItem("splash_done", "1");
      window.dispatchEvent(new Event("splash-finished"));
    }
  }, [splashDone]);

  // Handle direct hash navigation smoothly (e.g. user clicked /#contact from /privacy)
  useEffect(() => {
    if (splashDone && typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      const timer = setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [splashDone]);

  const handleFinish = () => {
    setSplashDone(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("portfolio_splash_seen", "1");
      sessionStorage.setItem("splash_done", "1");
      window.dispatchEvent(new Event("splash-finished"));
    }
  };

  return (
    <>
      {mounted && !splashDone && <SplashScreen onFinish={handleFinish} />}
      <PersonalPortfolio splashDone={splashDone} />
    </>
  );
}
