import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/features/nav/site-nav";
import { SiteFooter } from "@/features/nav/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://omkarvchalke.github.io";
const DESCRIPTION =
  "I build scalable software, intelligent data platforms, and AI-powered applications.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Omkar Vilas Chalke",
    template: "%s — Omkar Vilas Chalke",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Omkar Vilas Chalke",
    description: DESCRIPTION,
    siteName: "Omkar Vilas Chalke",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omkar Vilas Chalke",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SiteNav />
          <main>{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
