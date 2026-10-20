"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import PersonalPortfolio from "@/pages/PersonalPortfolio";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && (
        <SplashScreen
          onFinish={() => {
            setSplashDone(true);
            if (typeof window !== "undefined") {
              sessionStorage.setItem("splash_done", "1");
              window.dispatchEvent(new Event("splash-finished"));
            }
          }}
        />
      )}
      <PersonalPortfolio splashDone={splashDone} />
    </>
  );
}
