import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/catalog/Catalog";
import { getMessages, isLocale } from "@/lib/i18n";
import { seedCategories, seedTemplates } from "@/lib/seed";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const messages = getMessages(locale);
  return {
    title: `${messages.catalog.title} | Kaios`,
    description: messages.catalog.body,
  };
}

export default async function TemplatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const category =
    typeof query.category === "string" &&
    seedCategories.some((item) => item.slug === query.category)
      ? query.category
      : "";

  return (
    <div className="catalog-page page-shell">
      <header className="catalog-hero">
        <p className="eyebrow">{messages.catalog.eyebrow}</p>
        <h1>{messages.catalog.title}</h1>
        <p>{messages.catalog.body}</p>
      </header>
      <Catalog
        initialCategories={seedCategories}
        initialTemplates={seedTemplates}
        initialCategory={category}
        locale={locale}
        messages={messages}
      />
    </div>
  );
}
