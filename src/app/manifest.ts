import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ahmad Abdullah — Full-Stack Developer",
    short_name: "Ahmad Abdullah",
    description:
      "Full-stack mobile & web engineer building connected systems with Flutter, React Native, Next.js, and Supabase.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0e13",
    theme_color: "#8a0303",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
