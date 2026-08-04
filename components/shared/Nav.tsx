"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useContact } from "@/components/shared/ContactContext";
import { Messages } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export function Nav({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openContact } = useContact();

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <Link className="wordmark" href={`/${locale}`} aria-label="Kaios home">
          <span className="wordmark-bracket" aria-hidden="true">
            [
          </span>
          KAIOS
          <span className="wordmark-bracket" aria-hidden="true">
            ]
          </span>
        </Link>

        <nav
          className={`nav-links ${menuOpen ? "is-open" : ""}`}
          aria-label="Primary navigation"
        >
          <Link href={`/${locale}`} onClick={() => setMenuOpen(false)}>
            {messages.nav.home}
          </Link>
          <Link
            href={`/${locale}/templates`}
            onClick={() => setMenuOpen(false)}
          >
            {messages.nav.templates}
          </Link>
          <Link
            href={`/${locale}#how-it-works`}
            onClick={() => setMenuOpen(false)}
          >
            {messages.nav.howItWorks}
          </Link>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openContact();
            }}
          >
            {messages.nav.contact}
          </button>
        </nav>

        <div className="nav-actions">
          <LanguageToggle locale={locale} />
          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? messages.nav.closeMenu : messages.nav.menu}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
