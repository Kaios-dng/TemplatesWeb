import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/shared/Footer";
import { Nav } from "@/components/shared/Nav";
import { getMessages, isLocale } from "@/lib/i18n";
import { locales } from "@/lib/types";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const messages = getMessages(locale);
  return {
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      languages: {
        vi: "/vi",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);

  return (
    <>
      <Nav locale={locale} messages={messages} />
      <main id="main-content">{children}</main>
      <Footer locale={locale} messages={messages} />
    </>
  );
}

