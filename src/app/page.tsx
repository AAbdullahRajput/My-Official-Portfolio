"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import PersonalPortfolio from "@/pages/PersonalPortfolio";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    localStorage.removeItem("splash_seen"); // TEMP: force splash to always play while iterating
  }, []);

  return (
    <>
      <SplashScreen onFinish={() => setSplashDone(true)} />
      {/* <PersonalPortfolio splashDone={splashDone} /> */}
    </>
  );
}