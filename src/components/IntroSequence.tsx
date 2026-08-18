"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import GramophonePlayer from "@/pages/GramophonePlayer";

export default function IntroSequence() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      <SplashScreen onFinish={() => setSplashDone(true)} />
      <GramophonePlayer active={splashDone} />
    </>
  );
}