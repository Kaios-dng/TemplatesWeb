export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

export type LocalizedText = {
  en: string;
  vi: string;
};

export type Category = {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  order: number;
  active: boolean;
};

export type MediaItem = {
  url: string;
  alt: LocalizedText;
  width: number;
  height: number;
};

export type TemplateRecord = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  categoryName: LocalizedText;
  excerpt: LocalizedText;
  description: LocalizedText;
  tags: string[];
  techStack: string[];
  price: {
    amount: number;
    currency: "USD" | "VND";
  };
  liveDemoUrl: string;
  coverImage: MediaItem;
  gallery: MediaItem[];
  featured: boolean;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type Inquiry = {
  id: string;
  templateId: string | null;
  templateSlug: string | null;
  templateName: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  locale: Locale;
  status: "new" | "contacted" | "closed";
  createdAt?: unknown;
};

export type InquiryInput = Omit<Inquiry, "id" | "status" | "createdAt">;

export type TemplateDraft = Omit<
  TemplateRecord,
  "id" | "createdAt" | "updatedAt"
>;

