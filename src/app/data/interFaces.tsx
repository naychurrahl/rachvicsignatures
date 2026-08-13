
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
