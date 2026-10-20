import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ahmad Abdullah Portfolio",
    short_name: "Ahmad Abdullah",
    description: "Ahmad Abdullah Portfolio.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0e13",
    theme_color: "#8a0303",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
