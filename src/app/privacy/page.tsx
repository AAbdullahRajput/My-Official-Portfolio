import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy — Ahmad Abdullah Portfolio.",
  openGraph: {
    title: "Privacy Policy | Ahmad Abdullah Portfolio",
    description: "Privacy Policy — Ahmad Abdullah Portfolio.",
    type: "website",
    url: "https://ahmadabdullah.dev/privacy",
    images: ["/images/profile.jpeg"],
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Ahmad Abdullah Portfolio",
    description: "Privacy Policy — Ahmad Abdullah Portfolio.",
    images: ["/images/profile.jpeg"],
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
