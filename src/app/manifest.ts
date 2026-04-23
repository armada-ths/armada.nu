import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "THS Armada",
        short_name: "Armada",
        description:
            "KTH's and Sweden's largest student-driven career fair",
        icons: [
            {
                src: "/icons/pwa-64x64.png",
                sizes: "64x64",
                type: "image/png"
            },
            {
                src: "/icons/pwa-192x192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "/icons/pwa-512x512.png",
                sizes: "512x512",
                type: "image/png"
            },
            {
                src: "/icons/maskable-icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable"
            }
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#48bc8e",
        background_color: "#2d2d2c"
    }
}
