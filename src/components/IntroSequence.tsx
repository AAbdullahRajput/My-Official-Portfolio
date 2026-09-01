// "use client";

// import { useState } from "react";
// import SplashScreen from "@/components/SplashScreen";
// import GramophonePlayer from "@/pages/GramophonePlayer";
// import PersonalPortfolio from "@/pages/PersonalPortfolio"; // adjust path to match your actual file location

"use client";

// export default function IntroSequence() {
//   const [splashDone, setSplashDone] = useState(false);

//   return (
//     <>
//       <SplashScreen onFinish={() => setSplashDone(true)} />
//       {/* {splashDone && <GramophonePlayer active={true} />}
//       <PersonalPortfolio splashDone={splashDone} /> */}
//     </>
//   );
// }

export default function IntroSequence() {
  return null; // TEMP: SplashScreen now lives only in page.tsx to avoid double-mounting
}