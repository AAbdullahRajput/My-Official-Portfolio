"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import PersonalPortfolio from "@/pages/PersonalPortfolio";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    localStorage.removeItem("splash_seen"); // TEMP-SPLASH-DEV: delete this whole effect when done
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
      {/* <PersonalPortfolio splashDone={splashDone} /> */}
    </>
  );
}