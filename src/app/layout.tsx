import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import TopReadingProgressBar from "@/components/TopReadingProgressBar";
import GramophonePlayer from "@/pages/GramophonePlayer";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
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
  metadataBase: new URL("https://ahmadabdullah.dev"),
  title: {
    default: "Ahmad Abdullah — Full-Stack Developer",
    template: "%s | Ahmad Abdullah",
  },
  description:
    "Full-stack mobile & web engineer building connected systems with Flutter, React Native, Next.js, and Supabase.",
  keywords: [
    "Ahmad Abdullah",
    "Full-Stack Developer",
    "Flutter Developer",
    "React Native Developer",
    "Next.js Developer",
    "Software Engineer",
    "Mobile App Developer",
    "Islamabad",
    "Pakistan",
  ],
  authors: [{ name: "Ahmad Abdullah", url: "https://ahmadabdullah.dev" }],
  creator: "Ahmad Abdullah",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ahmadabdullah.dev",
    siteName: "Ahmad Abdullah Portfolio",
    title: "Ahmad Abdullah — Full-Stack Developer",
    description:
      "Full-stack mobile & web engineer building connected systems with Flutter, React Native, Next.js, and Supabase.",
    images: [
      {
        url: "/images/profile.jpeg",
        width: 800,
        height: 800,
        alt: "Ahmad Abdullah — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Abdullah — Full-Stack Developer",
    description:
      "Full-stack mobile & web engineer building connected systems with Flutter, React Native, Next.js, and Supabase.",
    images: ["/images/profile.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F7F6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e13" },
  ],
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
        <TopReadingProgressBar />
        <CustomCursor />
        <SpiderWebBackground />
        <GramophonePlayer active={true} />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
