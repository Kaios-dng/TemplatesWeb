import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ContactBand } from "@/components/home/ContactBand";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { getMessages, isLocale } from "@/lib/i18n";
import { seedCategories, seedTemplates } from "@/lib/seed";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const messages = getMessages(locale);
  return (
    <>
      <Hero locale={locale} messages={messages} />
      <div className="page-shell">
        <CategoryShowcase
          categories={seedCategories}
          locale={locale}
          messages={messages}
        />
        <FeaturedGrid
          templates={seedTemplates.filter((item) => item.featured)}
          locale={locale}
          messages={messages}
        />
        <HowItWorks messages={messages} />
        <ContactBand messages={messages} />
      </div>
    </>
  );
}

