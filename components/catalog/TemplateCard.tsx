"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PointerEvent, useEffect, useRef } from "react";
import { BrowserFrame } from "@/components/shared/BrowserFrame";
import { usePreviewCoordinator } from "@/components/shared/PreviewCoordinator";
import { formatPrice } from "@/lib/format";
import { localize, Messages } from "@/lib/i18n";
import { resolveDemoUrl } from "@/lib/seed";
import { Locale, TemplateRecord } from "@/lib/types";

export function TemplateCard({
  template,
  locale,
  messages,
  priority = false,
}: {
  template: TemplateRecord;
  locale: Locale;
  messages: Messages;
  priority?: boolean;
}) {
  const { activeId, requestPreview, releasePreview } = usePreviewCoordinator();
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActive = activeId === template.id;
  const demoUrl = resolveDemoUrl(template);

  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    },
    [],
  );

  function startIntent(delay: number) {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => requestPreview(template.id), delay);
  }

  function clearIntent(release = false) {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
    if (release) releasePreview(template.id);
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") startIntent(500);
  }

  return (
    <article
      className={`template-card ${isActive ? "is-previewing" : ""}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") startIntent(400);
      }}
      onPointerLeave={() => clearIntent(true)}
      onPointerDown={onPointerDown}
      onPointerUp={() => clearIntent(false)}
      onPointerCancel={() => clearIntent(true)}
    >
      <BrowserFrame
        className="template-browser"
        label={`${template.name}: ${messages.card.live}`}
        address={template.liveDemoUrl === "PLACEHOLDER_LIVE_URL" ? "replace-with-live-url" : template.liveDemoUrl}
      >
        {isActive ? (
          <iframe
            className="card-live-frame"
            src={`${demoUrl}${demoUrl.includes("?") ? "&" : "?"}embed=card`}
            title={`${template.name} ${messages.card.live}`}
            loading={priority ? "eager" : "lazy"}
            tabIndex={-1}
          />
        ) : (
          <div className={`template-poster poster-${template.categorySlug}`}>
            <span className="poster-name">{template.name}</span>
            <span className="poster-label">{messages.card.placeholder}</span>
            <div className="poster-structure" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <span className="preview-intent" aria-hidden="true">
          {isActive ? messages.card.live : messages.card.previewHint}
        </span>
      </BrowserFrame>
      <div className="template-card-meta">
        <div>
          <span className="template-category">
            {localize(template.categoryName, locale)}
          </span>
          <h3>
            <Link href={`/${locale}/templates/${template.slug}`}>
              {template.name}
            </Link>
          </h3>
          <p>{localize(template.excerpt, locale)}</p>
        </div>
        <div className="template-card-actions">
          <strong>
            {messages.card.from}{" "}
            {formatPrice(template.price.amount, template.price.currency, locale)}
          </strong>
          <a href={demoUrl} target="_blank" rel="noreferrer">
            {messages.card.newTab}
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
