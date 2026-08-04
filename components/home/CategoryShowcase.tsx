"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { localize, Messages } from "@/lib/i18n";
import { Category, Locale } from "@/lib/types";

export function CategoryShowcase({
  categories,
  locale,
  messages,
}: {
  categories: Category[];
  locale: Locale;
  messages: Messages;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.from(".category-piece", {
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          scrollTrigger: { trigger: root.current, start: "top 82%" },
        });
        return;
      }
      gsap.from(".category-piece", {
        opacity: 0,
        y: window.innerWidth < 768 ? 12 : 24,
        scale: 0.96,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="category-section" ref={root}>
      <div className="section-heading vertical">
        <h2>{messages.categories.title}</h2>
        <p>{messages.categories.body}</p>
      </div>
      <div className="category-composition">
        {categories.slice(0, 3).map((category, index) => (
          <Link
            key={category.id}
            className={`category-piece category-piece-${index + 1}`}
            href={`/${locale}/templates?category=${category.slug}`}
          >
            <span className="category-name">{localize(category.name, locale)}</span>
            <p>{localize(category.description, locale)}</p>
            <span className="category-link">
              {messages.categories.view}
              <ArrowUpRight aria-hidden="true" />
            </span>
            <div className="category-blueprint" aria-hidden="true">
              <span />
              <span />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

