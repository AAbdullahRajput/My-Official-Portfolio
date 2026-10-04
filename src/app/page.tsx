"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import GramophonePlayer from "@/pages/GramophonePlayer";
import PersonalPortfolio from "@/pages/PersonalPortfolio";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
      {splashDone && <GramophonePlayer active={true} />}
      <PersonalPortfolio splashDone={splashDone} />
    </>
  );
}