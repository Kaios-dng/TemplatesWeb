# Kaios discovery lock

## Routing

| Route | Purpose | Rendering and access |
| --- | --- | --- |
| `/` | Locale entry | Redirect to `/vi` |
| `/[locale]` | Home | Static shell with Firestore-backed featured content |
| `/[locale]/templates` | Catalog | Locale-aware, published templates only |
| `/[locale]/templates/[slug]` | Template detail | Locale-aware, published template with related items |
| `/login` | Admin sign-in | Public, no sign-up |
| `/admin` | Templates and inquiries dashboard | Firebase Auth guard, noindex |
| `/templates/new` | Create template | Firebase Auth guard, noindex |
| `/templates/[id]/edit` | Edit template | Firebase Auth guard, noindex |

The request locale is forwarded by `proxy.ts` so the root layout writes the real
route locale to the document `lang` attribute. Locale switches replace the URL
prefix and preserve the rest of the path.

## Firestore model

### `categories/{categoryId}`

```ts
{
  slug: string;
  name: { en: string; vi: string };
  description: { en: string; vi: string };
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Category options are loaded from this collection. The three starter categories
are seed content only, not a compiled enum.

### `templates/{templateId}`

```ts
{
  name: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  categoryName: { en: string; vi: string };
  excerpt: { en: string; vi: string };
  description: { en: string; vi: string };
  tags: string[];
  techStack: string[];
  price: { amount: number; currency: "USD" | "VND" };
  liveDemoUrl: string;
  coverImage: {
    url: string;
    alt: { en: string; vi: string };
    width: number;
    height: number;
  };
  gallery: Array<{
    url: string;
    alt: { en: string; vi: string };
    width: number;
    height: number;
  }>;
  featured: boolean;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

`categorySlug` and `categoryName` are intentional snapshots. They keep public
catalog queries and cards inexpensive while `categoryId` remains the canonical
relationship.

### `inquiries/{inquiryId}`

```ts
{
  templateId: string | null;
  templateSlug: string | null;
  templateName: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  locale: "en" | "vi";
  status: "new" | "contacted" | "closed";
  createdAt: Timestamp;
}
```

The template fields are snapshots so an inquiry remains intelligible after a
template is renamed or removed.

## Storage

Template media is stored under `templates/{templateId}/...`. Public reads are
allowed because catalog media is public. Writes require an authenticated admin.
The client validates file type and size before upload.

## Rendering and failure behavior

- Marketing copy and route shells are static.
- Catalog data reads from Firestore in the browser when Firebase is configured.
- Clearly labelled starter records keep the UI runnable before Firebase setup.
- Live iframes are not mounted on grid load. A single shared preview coordinator
  ensures only the currently intended card can mount one.
- A placeholder poster is generated with CSS and explicit copy. No external
  screenshots, logos, testimonials, or credentials are invented.

## Access control

- There is no public sign-up route or sign-up action.
- `AdminAuthGuard` redirects signed-out users to `/login`.
- Firestore rules allow public reads only for active categories and published
  templates. Inquiry creation is public with field validation. All admin reads
  and writes require Firebase Auth.
- Storage uploads and deletes require Firebase Auth.
- Admin and editor pages export `noindex, nofollow` metadata.

