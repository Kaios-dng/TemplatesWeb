"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react";
import { TemplateCard } from "@/components/catalog/TemplateCard";
import { BrowserFrame } from "@/components/shared/BrowserFrame";
import { useContact } from "@/components/shared/ContactContext";
import { formatPrice } from "@/lib/format";
import { getTemplateBySlug } from "@/lib/firestore";
import { localize, Messages } from "@/lib/i18n";
import { resolveDemoUrl } from "@/lib/seed";
import { Locale, TemplateRecord } from "@/lib/types";

type Device = "desktop" | "tablet" | "mobile";

const deviceIcons = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
} as const;

export function TemplateDetail({
  slug,
  initialTemplate,
  relatedTemplates,
  locale,
  messages,
}: {
  slug: string;
  initialTemplate: TemplateRecord | null;
  relatedTemplates: TemplateRecord[];
  locale: Locale;
  messages: Messages;
}) {
  const [template, setTemplate] = useState<TemplateRecord | null>(
    initialTemplate,
  );
  const [state, setState] = useState<"loading" | "ready" | "missing">(
    initialTemplate ? "ready" : "loading",
  );
  const [device, setDevice] = useState<Device>("desktop");
  const { openContact } = useContact();

  useEffect(() => {
    let active = true;
    getTemplateBySlug(slug)
      .then((item) => {
        if (!active) return;
        setTemplate(item);
        setState(item ? "ready" : "missing");
      })
      .catch(() => {
        if (active) setState(initialTemplate ? "ready" : "missing");
      });
    return () => {
      active = false;
    };
  }, [initialTemplate, slug]);

  const related = useMemo(
    () =>
      template
        ? relatedTemplates
            .filter(
              (item) =>
                item.id !== template.id &&
                item.categorySlug === template.categorySlug,
            )
            .slice(0, 2)
        : [],
    [relatedTemplates, template],
  );

  if (state === "loading") {
    return (
      <div className="detail-loading" role="status">
        <span />
        <span />
        <p>{messages.detail.loading}</p>
      </div>
    );
  }

  if (state === "missing" || !template) {
    return (
      <div className="detail-missing">
        <h1>{messages.detail.notFound}</h1>
        <Link className="button primary" href={`/${locale}/templates`}>
          {messages.detail.back}
        </Link>
      </div>
    );
  }

  const demoUrl = resolveDemoUrl(template);

  return (
    <article className="template-detail">
      <header className="detail-head">
        <Link className="detail-back" href={`/${locale}/templates`}>
          {messages.detail.back}
        </Link>
        <div className="detail-title-row">
          <div>
            <span className="template-category">
              {localize(template.categoryName, locale)}
            </span>
            <h1>{template.name}</h1>
            <p>{localize(template.excerpt, locale)}</p>
          </div>
          <div className="detail-purchase">
            <strong>
              {messages.card.from}{" "}
              {formatPrice(
                template.price.amount,
                template.price.currency,
                locale,
              )}
            </strong>
            <button
              className="button primary"
              type="button"
              onClick={() => openContact(template)}
            >
              {messages.detail.buy}
            </button>
          </div>
        </div>
      </header>

      <section className="detail-cover" aria-label={template.coverImage.alt[locale]}>
        {template.coverImage.url === "PLACEHOLDER_COVER_IMAGE" ? (
          <div className={`detail-poster poster-${template.categorySlug}`}>
            <span>{template.name}</span>
            <small>{localize(template.categoryName, locale)}</small>
          </div>
        ) : (
          <Image
            src={template.coverImage.url}
            alt={localize(template.coverImage.alt, locale)}
            width={template.coverImage.width}
            height={template.coverImage.height}
            priority
            sizes="(max-width: 767px) 100vw, 1440px"
          />
        )}
      </section>

      <section className="detail-info">
        <div>
          <h2>{messages.detail.about}</h2>
          <p>{localize(template.description, locale)}</p>
        </div>
        <div className="detail-stack">
          <h2>{messages.detail.stack}</h2>
          <ul>
            {template.techStack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="responsive-preview">
        <div className="responsive-head">
          <div>
            <h2>{messages.detail.responsive}</h2>
            <p>{messages.detail.responsiveBody}</p>
          </div>
          <div className="device-controls" aria-label={messages.detail.responsive}>
            {(Object.keys(deviceIcons) as Device[]).map((item) => {
              const Icon = deviceIcons[item];
              return (
                <button
                  key={item}
                  type="button"
                  className={device === item ? "is-active" : ""}
                  onClick={() => setDevice(item)}
                  aria-pressed={device === item}
                >
                  <Icon aria-hidden="true" />
                  {messages.detail[item]}
                </button>
              );
            })}
          </div>
        </div>
        <div className={`responsive-stage device-${device}`}>
          <BrowserFrame
            className="responsive-browser"
            label={`${template.name}: ${messages.detail.responsive}`}
            address={demoUrl}
          >
            <iframe
              src={demoUrl}
              title={`${template.name} ${messages.card.live}`}
              loading="lazy"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
            />
          </BrowserFrame>
        </div>
        <a
          className="section-link"
          href={demoUrl}
          target="_blank"
          rel="noreferrer"
        >
          {messages.card.newTab}
          <ExternalLink aria-hidden="true" />
        </a>
      </section>

      {related.length ? (
        <section className="related-section">
          <h2>{messages.detail.related}</h2>
          <div className="related-grid">
            {related.map((item) => (
              <TemplateCard
                key={item.id}
                template={item}
                locale={locale}
                messages={messages}
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
