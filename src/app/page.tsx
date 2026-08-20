"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import PersonalPortfolio from "@/pages/PersonalPortfolio";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      <SplashScreen onFinish={() => setSplashDone(true)} />
      <PersonalPortfolio splashDone={splashDone} />
    </>
  );
}