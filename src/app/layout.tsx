import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import IntroSequence from "@/components/IntroSequence";
import SpiderWebBackground from "@/components/SpiderWebBackground";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ahmad Abdullah — Full-Stack Developer",
  description:
    "Full-stack mobile & web engineer building connected systems with Flutter, Next.js, and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} ${cormorantGaramond.variable} font-body antialiased`}
        suppressHydrationWarning
      >
                <CustomCursor />
        <IntroSequence />
        {/* <SpiderWebBackground /> */}
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}