"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { TemplateRecord } from "@/lib/types";

type ContactContextValue = {
  isOpen: boolean;
  selectedTemplate: TemplateRecord | null;
  openContact: (template?: TemplateRecord | null) => void;
  closeContact: () => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateRecord | null>(null);
  const openContact = useCallback((template: TemplateRecord | null = null) => {
    setSelectedTemplate(template);
    setOpen(true);
  }, []);
  const closeContact = useCallback(() => {
    setOpen(false);
    setSelectedTemplate(null);
  }, []);
  const value = useMemo(
    () => ({ isOpen, selectedTemplate, openContact, closeContact }),
    [isOpen, selectedTemplate, openContact, closeContact],
  );
  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);
  if (!context) throw new Error("useContact requires ContactProvider");
  return context;
}
