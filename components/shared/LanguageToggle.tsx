"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/types";
import { swapLocalePath } from "@/lib/i18n";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nextLocale: Locale = locale === "vi" ? "en" : "vi";
  return (
    <Link
      className="language-toggle"
      href={swapLocalePath(pathname, nextLocale)}
      hrefLang={nextLocale}
      aria-label={nextLocale === "vi" ? "Đổi sang tiếng Việt" : "Switch to English"}
    >
      <span className={locale === "vi" ? "is-current" : ""}>VI</span>
      <span aria-hidden="true">/</span>
      <span className={locale === "en" ? "is-current" : ""}>EN</span>
    </Link>
  );
}

