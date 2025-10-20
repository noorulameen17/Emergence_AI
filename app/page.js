import { Hero } from "../components/hero";

export default function Home() {
  return (
    <main className="min-h-dvh bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Emergence AI",
            url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            potentialAction: {
              "@type": "SearchAction",
              target: `${
                process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
              }/generate?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <Hero />
    </main>
  );
}
