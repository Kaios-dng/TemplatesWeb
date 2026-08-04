import en from "@/messages/en.json";
import vi from "@/messages/vi.json";
import { Locale, LocalizedText, locales } from "@/lib/types";

export type Messages = typeof en;

const dictionaries: Record<Locale, Messages> = {
  en,
  vi: vi as Messages,
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function localize(value: LocalizedText, locale: Locale): string {
  return value[locale] || value.vi || value.en;
}

export function swapLocalePath(pathname: string, locale: Locale): string {
  const parts = pathname.split("/");
  if (parts[1] === "en" || parts[1] === "vi") {
    parts[1] = locale;
    return parts.join("/") || `/${locale}`;
  }
  return `/${locale}`;
}

