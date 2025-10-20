import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import "ldrs/react/Treadmill.css";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// SEO: site URL for canonical/OG/robots/sitemap
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const isProd =
  process.env.NODE_ENV === "production" && !siteUrl.includes("localhost");

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Emergence AI | Disaster Assistant",
    template: "%s | Emergence AI",
  },
  description:
    "AI support for disaster preparedness and response. Get calm, step‑by‑step guidance during floods, earthquakes, wildfires and more.",
  applicationName: "Emergence AI",
  keywords: [
    "disaster assistant",
    "emergency preparedness",
    "wildfire safety",
    "flood safety",
    "earthquake safety",
    "AI safety app",
    "github",
    "webapp",
    "chatbot",
    "artificial intelligence",
  ],
  authors: [{ name: "Emergence AI" }],
  creator: "Emergence AI",
  publisher: "Emergence AI",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  openGraph: {
    type: "website",
    url: "/",
    title: "Emergence AI | Disaster Assistant",
    description:
      "AI support for disaster preparedness and response. Get calm, step‑by‑step guidance during floods, earthquakes, wildfires and more.",
    siteName: "Emergence AI",
    locale: "en_US",
    images: [
      {
        url: "/Emergence 2.png",
        width: 1200,
        height: 630,
        alt: "Emergence AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emergence AI | Disaster Assistant",
    description:
      "AI support for disaster preparedness and response. Get calm, step‑by‑step guidance during floods, earthquakes, wildfires and more.",
    images: ["/Emergence 2.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  alternates: {
    canonical: "/",
  },
  robots: isProd
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      }
    : {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
  appleWebApp: {
    title: "Emergence AI",
    capable: true,
    statusBarStyle: "default",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" dir="ltr">
        <body className={`${inter.className} ${spaceGrotesk.variable}`}>
          {/* JSON-LD Organization */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Emergence AI",
                url: siteUrl,
                logo: `${siteUrl}/Emergence 2.png`,
              }),
            }}
          />
          {children}
          <Analytics />
          <noscript>
            Enable JavaScript to get the best experience on Emergence AI.
          </noscript>
        </body>
      </html>
    </ClerkProvider>
  );
}
