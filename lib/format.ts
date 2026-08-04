import { Locale } from "@/lib/types";

export function formatPrice(
  amount: number,
  currency: "USD" | "VND",
  locale: Locale,
): string {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

