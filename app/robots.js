// Next.js app router robots
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const allow = process.env.NODE_ENV === "production";
  return {
    rules: allow
      ? {
          userAgent: "*",
          allow: "/",
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
