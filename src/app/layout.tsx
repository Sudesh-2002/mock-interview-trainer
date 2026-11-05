import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteName, siteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

const title = `${siteName}: AI Mock Interview Trainer`;
const description =
  "Practice interviews with AI-generated questions, rubric-based scoring, voice input and progress tracking. No sign-up needed to try it.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${siteName}` },
  description,
  openGraph: { title, description, type: "website", siteName },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col antialiased`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}