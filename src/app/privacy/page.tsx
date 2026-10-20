import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy — Ahmad Abdullah",
  description:
    "Transparency on data privacy, zero tracking, GDPR compliance, and how your information is handled when visiting Ahmad Abdullah's portfolio.",
  openGraph: {
    title: "Privacy Policy — Ahmad Abdullah",
    description:
      "Transparency on data privacy, zero tracking, GDPR compliance, and security architecture.",
    type: "website",
    url: "https://ahmadabdullah.dev/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
