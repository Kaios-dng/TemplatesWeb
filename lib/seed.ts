import { Category, TemplateRecord } from "@/lib/types";

export const seedCategories: Category[] = [
  {
    id: "starter-business",
    slug: "business",
    name: { en: "Business", vi: "Doanh nghiệp" },
    description: {
      en: "Clear offers, dependable navigation, and a direct path to inquiry.",
      vi: "Trình bày dịch vụ rõ ràng, điều hướng chắc chắn và dẫn thẳng đến liên hệ.",
    },
    order: 1,
    active: true,
  },
  {
    id: "starter-portfolio",
    slug: "portfolio",
    name: { en: "Portfolio", vi: "Hồ sơ năng lực" },
    description: {
      en: "Project-led storytelling for independent studios and specialists.",
      vi: "Kể câu chuyện qua dự án dành cho studio độc lập và người làm chuyên môn.",
    },
    order: 2,
    active: true,
  },
  {
    id: "starter-commerce",
    slug: "e-commerce",
    name: { en: "E-commerce", vi: "Thương mại điện tử" },
    description: {
      en: "Product pages and shopping paths designed around confident decisions.",
      vi: "Trang sản phẩm và hành trình mua sắm giúp khách hàng dễ quyết định.",
    },
    order: 3,
    active: true,
  },
];

const placeholderCover = (name: string) => ({
  url: "PLACEHOLDER_COVER_IMAGE",
  alt: {
    en: `Placeholder poster for the ${name} template`,
    vi: `Ảnh chờ cho mẫu website ${name}`,
  },
  width: 1600,
  height: 1000,
});

export const seedTemplates: TemplateRecord[] = [
  {
    id: "starter-rivet",
    name: "Rivet Works",
    slug: "rivet-works",
    categoryId: "starter-business",
    categorySlug: "business",
    categoryName: { en: "Business", vi: "Doanh nghiệp" },
    excerpt: {
      en: "A precise service site for small teams selling considered work.",
      vi: "Website dịch vụ mạch lạc cho đội ngũ nhỏ cung cấp công việc chỉn chu.",
    },
    description: {
      en: "Rivet Works gives a service business a disciplined home for its offer, process, selected work, and inquiries. The structure favors quick scanning without reducing the brand to a generic sales page.",
      vi: "Rivet Works tạo một nền tảng gọn gàng để doanh nghiệp dịch vụ giới thiệu năng lực, quy trình, dự án và nhận yêu cầu. Cấu trúc giúp khách xem nhanh nhưng vẫn giữ được bản sắc riêng.",
    },
    tags: ["services", "studio", "bilingual"],
    techStack: ["Next.js", "TypeScript", "GSAP"],
    price: { amount: 420, currency: "USD" },
    liveDemoUrl: "PLACEHOLDER_LIVE_URL",
    coverImage: placeholderCover("Rivet Works"),
    gallery: [],
    featured: true,
    published: true,
  },
  {
    id: "starter-canvas",
    name: "Canvas Index",
    slug: "canvas-index",
    categoryId: "starter-portfolio",
    categorySlug: "portfolio",
    categoryName: { en: "Portfolio", vi: "Hồ sơ năng lực" },
    excerpt: {
      en: "An image-led portfolio with room for process, context, and detail.",
      vi: "Hồ sơ năng lực ưu tiên hình ảnh, đồng thời đủ chỗ cho quy trình và bối cảnh.",
    },
    description: {
      en: "Canvas Index is built for designers, photographers, and compact studios that need projects to lead. Flexible case-study modules hold both short visual work and deeper process stories.",
      vi: "Canvas Index dành cho nhà thiết kế, nhiếp ảnh gia và studio nhỏ muốn dự án dẫn dắt câu chuyện. Các mô-đun linh hoạt phù hợp cả bài giới thiệu ngắn lẫn quy trình chuyên sâu.",
    },
    tags: ["creative", "case-study", "minimal"],
    techStack: ["Next.js", "TypeScript", "CSS"],
    price: { amount: 360, currency: "USD" },
    liveDemoUrl: "PLACEHOLDER_LIVE_URL",
    coverImage: placeholderCover("Canvas Index"),
    gallery: [],
    featured: true,
    published: true,
  },
  {
    id: "starter-field",
    name: "Field Supply",
    slug: "field-supply",
    categoryId: "starter-commerce",
    categorySlug: "e-commerce",
    categoryName: { en: "E-commerce", vi: "Thương mại điện tử" },
    excerpt: {
      en: "A product-first storefront for a focused, tactile collection.",
      vi: "Cửa hàng ưu tiên sản phẩm dành cho bộ sưu tập cô đọng và giàu cảm giác.",
    },
    description: {
      en: "Field Supply balances product clarity with enough brand texture to feel distinct. Collection pages, product detail, and cart-ready patterns are composed around low-friction browsing.",
      vi: "Field Supply cân bằng giữa thông tin sản phẩm rõ ràng và cảm giác thương hiệu riêng. Trang bộ sưu tập, chi tiết sản phẩm và cấu trúc sẵn sàng cho giỏ hàng đều hướng đến trải nghiệm dễ xem.",
    },
    tags: ["shop", "products", "editorial"],
    techStack: ["Next.js", "TypeScript", "Shopify-ready"],
    price: { amount: 580, currency: "USD" },
    liveDemoUrl: "PLACEHOLDER_LIVE_URL",
    coverImage: placeholderCover("Field Supply"),
    gallery: [],
    featured: true,
    published: true,
  },
  {
    id: "starter-practice",
    name: "Practice House",
    slug: "practice-house",
    categoryId: "starter-business",
    categorySlug: "business",
    categoryName: { en: "Business", vi: "Doanh nghiệp" },
    excerpt: {
      en: "A calm, trustworthy site for an independent professional practice.",
      vi: "Website điềm tĩnh, đáng tin cho văn phòng chuyên môn độc lập.",
    },
    description: {
      en: "Practice House helps a professional service explain expertise without overloading the page. Structured service detail and clear contact paths support considered client decisions.",
      vi: "Practice House giúp dịch vụ chuyên môn trình bày năng lực vừa đủ, không làm trang trở nên nặng nề. Chi tiết dịch vụ có cấu trúc và đường liên hệ rõ ràng giúp khách hàng dễ cân nhắc.",
    },
    tags: ["professional", "services", "calm"],
    techStack: ["Next.js", "TypeScript", "Firebase"],
    price: { amount: 390, currency: "USD" },
    liveDemoUrl: "PLACEHOLDER_LIVE_URL",
    coverImage: placeholderCover("Practice House"),
    gallery: [],
    featured: false,
    published: true,
  },
];

export function resolveDemoUrl(template: TemplateRecord): string {
  return template.liveDemoUrl === "PLACEHOLDER_LIVE_URL"
    ? `/preview/${template.slug}`
    : template.liveDemoUrl;
}

