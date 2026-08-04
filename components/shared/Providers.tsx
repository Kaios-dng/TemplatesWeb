"use client";

import { ReactNode } from "react";
import { ContactProvider } from "@/components/shared/ContactContext";
import { ContactDrawer } from "@/components/shared/ContactDrawer";
import { PreviewCoordinator } from "@/components/shared/PreviewCoordinator";
import { Messages } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
}) {
  return (
    <PreviewCoordinator>
      <ContactProvider>
        {children}
        <ContactDrawer locale={locale} messages={messages} />
      </ContactProvider>
    </PreviewCoordinator>
  );
}

