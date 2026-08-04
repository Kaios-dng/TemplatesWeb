import Link from "next/link";
import { TemplateCard } from "@/components/catalog/TemplateCard";
import { KaiosIcon } from "@/components/shared/KaiosIcon";
import { Messages } from "@/lib/i18n";
import { Locale, TemplateRecord } from "@/lib/types";

export function FeaturedGrid({
  templates,
  locale,
  messages,
}: {
  templates: TemplateRecord[];
  locale: Locale;
  messages: Messages;
}) {
  return (
    <section className="featured-section">
      <div className="section-heading vertical">
        <h2>{messages.featured.title}</h2>
        <p>{messages.featured.body}</p>
      </div>
      <div className="featured-composition">
        {templates.slice(0, 3).map((template, index) => (
          <div className={`featured-item featured-item-${index + 1}`} key={template.id}>
            <TemplateCard
              template={template}
              locale={locale}
              messages={messages}
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      <Link className="section-link" href={`/${locale}/templates`}>
        {messages.featured.viewAll}
        <KaiosIcon name="arrowRight" />
      </Link>
    </section>
  );
}
