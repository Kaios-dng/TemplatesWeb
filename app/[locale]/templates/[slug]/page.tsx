import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplateDetail } from "@/components/catalog/TemplateDetail";
import { getMessages, isLocale, localize } from "@/lib/i18n";
import { seedTemplates } from "@/lib/seed";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const template = seedTemplates.find((item) => item.slug === slug);
  const messages = getMessages(locale);
  return {
    title: template
      ? `${template.name} | Kaios`
      : `${messages.catalog.title} | Kaios`,
    description: template
      ? localize(template.excerpt, locale)
      : messages.meta.description,
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const template =
    seedTemplates.find((item) => item.slug === slug && item.published) ?? null;

  return (
    <div className="detail-page page-shell">
      <TemplateDetail
        slug={slug}
        initialTemplate={template}
        relatedTemplates={seedTemplates}
        locale={locale}
        messages={messages}
      />
    </div>
  );
}
