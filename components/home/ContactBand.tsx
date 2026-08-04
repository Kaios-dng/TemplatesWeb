"use client";

import { ArrowUpRight } from "lucide-react";
import { useContact } from "@/components/shared/ContactContext";
import { Messages } from "@/lib/i18n";

export function ContactBand({ messages }: { messages: Messages }) {
  const { openContact } = useContact();
  return (
    <section className="contact-band">
      <h2>{messages.contact.title}</h2>
      <button type="button" onClick={() => openContact()}>
        {messages.nav.contact}
        <ArrowUpRight aria-hidden="true" />
      </button>
    </section>
  );
}

