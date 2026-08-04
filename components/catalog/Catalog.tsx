"use client";

import { useEffect, useMemo, useState } from "react";
import { TemplateCard } from "@/components/catalog/TemplateCard";
import { getCategories, getPublishedTemplates } from "@/lib/firestore";
import { localize, Messages } from "@/lib/i18n";
import { Category, Locale, TemplateRecord } from "@/lib/types";

type PriceFilter = "any" | "under500" | "from500";

export function Catalog({
  initialCategories,
  initialTemplates,
  initialCategory,
  locale,
  messages,
}: {
  initialCategories: Category[];
  initialTemplates: TemplateRecord[];
  initialCategory: string;
  locale: Locale;
  messages: Messages;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [templates, setTemplates] = useState(initialTemplates);
  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState<PriceFilter>("any");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );

  useEffect(() => {
    let active = true;
    Promise.all([getCategories(), getPublishedTemplates()])
      .then(([nextCategories, nextTemplates]) => {
        if (!active) return;
        setCategories(nextCategories);
        setTemplates(nextTemplates);
        setLoadState("ready");
      })
      .catch(() => {
        if (active) setLoadState("fallback");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (category) url.searchParams.set("category", category);
    else url.searchParams.delete("category");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }, [category]);

  const tags = useMemo(
    () =>
      Array.from(new Set(templates.flatMap((template) => template.tags))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [templates],
  );

  const visibleTemplates = useMemo(
    () =>
      templates.filter((template) => {
        if (category && template.categorySlug !== category) return false;
        if (
          selectedTags.length &&
          !selectedTags.every((tag) => template.tags.includes(tag))
        ) {
          return false;
        }
        if (price === "under500" && template.price.amount >= 500) return false;
        if (price === "from500" && template.price.amount < 500) return false;
        return true;
      }),
    [category, price, selectedTags, templates],
  );

  const hasFilters =
    Boolean(category) || price !== "any" || selectedTags.length > 0;

  function clearFilters() {
    setCategory("");
    setPrice("any");
    setSelectedTags([]);
  }

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  }

  return (
    <div className="catalog-layout">
      <aside className="catalog-filters" aria-label={messages.catalog.filters}>
        <div className="filter-heading">
          <h2>{messages.catalog.filters}</h2>
          {hasFilters ? (
            <button type="button" onClick={clearFilters}>
              {messages.catalog.clear}
            </button>
          ) : null}
        </div>

        <label className="filter-field">
          <span>{messages.catalog.category}</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">{messages.catalog.all}</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {localize(item.name, locale)}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>{messages.catalog.price}</span>
          <select
            value={price}
            onChange={(event) => setPrice(event.target.value as PriceFilter)}
          >
            <option value="any">{messages.catalog.anyPrice}</option>
            <option value="under500">{messages.catalog.under500}</option>
            <option value="from500">{messages.catalog.from500}</option>
          </select>
        </label>

        <fieldset className="tag-filter">
          <legend>{messages.catalog.tags}</legend>
          <div className="tag-options">
            {tags.map((tag) => (
              <label key={tag}>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                <span>{tag}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </aside>

      <section className="catalog-results" aria-live="polite">
        <div className="catalog-result-head">
          <p>
            <strong>{visibleTemplates.length}</strong>{" "}
            {messages.catalog.results}
          </p>
          {loadState === "loading" ? (
            <span className="catalog-state">{messages.catalog.loading}</span>
          ) : null}
          {loadState === "fallback" ? (
            <span className="catalog-state warning">
              {messages.catalog.fallback}
            </span>
          ) : null}
        </div>

        {visibleTemplates.length ? (
          <div className="catalog-grid">
            {visibleTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                locale={locale}
                messages={messages}
                priority={index < 2}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>{messages.catalog.empty}</h2>
            <p>{messages.catalog.emptyBody}</p>
            <button className="button primary" type="button" onClick={clearFilters}>
              {messages.catalog.clear}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
