import type { Metadata, Viewport } from "next";
import { Fraunces, Archivo, Space_Mono } from "next/font/google";
import {
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_NAME,
  SITE_OG_LOCALE,
  SITE_TITLE,
  SITE_URL,
  THEME_COLOR,
} from "@/lib/site";
import "./globals.css";

// Editorial serif for the title, a characterful grotesk for UI, and a mono
// for the "machine-readable" passport detailing.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
});

const body = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

// Site-wide metadata. Canonical, og:url and the robots policy are per page, so
// they are set by `pageMetadata()` (src/lib/site.ts) in each page, never here.
// That keeps error pages such as the 404 from claiming a canonical of "/" and
// from carrying a robots tag that contradicts Next's own `noindex` for them.
//
// `openGraph` and `twitter` here are the fallback for any route that does not
// call `pageMetadata()`. og:image and twitter:image come from
// src/app/opengraph-image.tsx and src/app/twitter-image.tsx, which Next merges
// in along with width, height, type and alt.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_OG_LOCALE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={SITE_LANG}
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
