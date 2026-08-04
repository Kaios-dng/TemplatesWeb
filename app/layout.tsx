import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/shared/Providers";
import { getMessages } from "@/lib/i18n";
import { Locale } from "@/lib/types";
import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kaios | Live website templates",
  description:
    "Browse working website templates, test every page live, and contact Kaios to make one yours.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-kaios-locale");
  const locale: Locale = headerLocale === "en" ? "en" : "vi";
  const messages = getMessages(locale);

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          {locale === "vi" ? "Đến nội dung chính" : "Skip to main content"}
        </a>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

