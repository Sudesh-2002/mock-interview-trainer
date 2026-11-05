export const siteName = "InterviewPrep";

/** Public base URL. Set NEXT_PUBLIC_SITE_URL if you add a custom domain. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");