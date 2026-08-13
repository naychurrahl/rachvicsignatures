
export type ModalScreen = "login" | "register" | "forgot" | "reset-sent";

export type Role = "admin" | "staff" | "customer";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string[];
  description: string;
  rating?: number;
  reviewCount?: number;
  // null/undefined = inherit the site-wide SiteSettings value; 0 = explicitly unlimited.
  orderItemLimit?: number | null;
  refundEnabled?: boolean | null;
  refundDays?: number | null;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderPayment {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface OrderInterface {
  id: string;
  date: string;
  userId: string;
  total: number;
  status: "new" | "in-progress" | "completed" | "cancelled";
  paymentStatus: "in-progress" | "failed" | "success";
  items: CartItem[];
  deliveryMethod: "delivery" | "pickup";
  address?: string;
  paymentMethod: string;
  payment?: OrderPayment;
}

export interface NewOrderInput {
  deliveryMethod: "delivery" | "pickup";
  address: string;
  paymentMethod: string;
}

export interface Staff {
  id?: string;
  name: string;
  email: string;
  role: "staff" | "admin";
  status: "active" | "inactive";
}

export interface apiData {
  url: string;
  method?: "GET" | "POST" | "OPTIONS" | "PUT" | "DELETE";
  body?: any;
  headers?: object;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  role: Role;
  theme?: "light" | "dark" | null;
}

export interface HeroSlide {
  id: string;
  image: string;
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  sortOrder: number;
  active: boolean;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  sortOrder: number;
}

export interface Policy {
  slug: string;
  title: string;
  body: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string | null;
  contactEmail: string;
  contactPhone: string;
  location: string;
  currencySymbol: string;
  deliveryFee: number;
  storeOpen: boolean;
  openTime: string;
  closeTime: string;
  refundEnabled: boolean;
  refundDays: number;
  orderItemLimit: number;
  socialLinks: SocialLink[];
  policies: Record<string, Policy>;
  heroSlides: HeroSlide[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  average: number;
  count: number;
}

export interface ChatMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: "customer" | "staff";
  message: string;
  createdAt: string;
}

export interface ChatTicket {
  id: string;
  customerId: string;
  staffId: string | null;
  status: "queued" | "claimed" | "closed";
  messages: ChatMessage[];
}

export interface ChatQueueTicket {
  id: string;
  customerId: string;
  status: "queued";
  createdAt: string;
}

export interface WhyChooseBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface SectionHeading {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export interface CollectionSpotlightContent {
  eyebrow?: string;
  // product ids the owner picked to rotate through; empty/missing falls back to auto top-rated pick.
  productIds?: string[];
}

export interface PromoBannerItem {
  id: string;
  image?: string | null;
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  sortOrder: number;
  active: boolean;
}

export interface SiteContent {
  featuredCategories: SectionHeading;
  newArrivals: SectionHeading;
  bestSellers: SectionHeading;
  promoBanners: PromoBannerItem[];
  shopAll: SectionHeading;
  collectionSpotlight: CollectionSpotlightContent;
  whyChooseUs: {
    eyebrow: string;
    title: string;
    benefits: WhyChooseBenefit[];
  };
  testimonials: SectionHeading;
  newsletter: {
    heading: string;
    body: string;
  };
}
