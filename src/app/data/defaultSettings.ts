import { SiteSettings } from "@/app/data/interFaces";

// Mirrors backend/misc/db.sql's site_settings/social_links/policies defaults so the UI
// never flashes blank/broken before GET /settings resolves (or if it fails).
export const DEFAULT_SETTINGS: SiteSettings = {
  contactEmail: "support@rachvicsignatures.com",
  contactPhone: "+234 800 000 0000",
  location: "Lagos, Nigeria",
  currencySymbol: "₦",
  deliveryFee: 5.99,
  storeOpen: true,
  openTime: "09:00",
  closeTime: "18:00",
  refundEnabled: true,
  refundDays: 30,
  orderItemLimit: 10,
  socialLinks: [
    { id: 1, platform: "instagram", url: "#", sortOrder: 0 },
    { id: 2, platform: "facebook", url: "#", sortOrder: 1 },
    { id: 3, platform: "twitter", url: "#", sortOrder: 2 },
  ],
  policies: {
    shipping: {
      slug: "shipping",
      title: "Shipping Policy",
      body: [
        "Orders are typically processed within 1-2 business days.",
        "Delivery timeframes vary by location and are estimated at checkout.",
        "You'll receive updates on your order status as it moves from processing to delivery.",
        "Contact our support team if your order hasn't arrived within the estimated window.",
      ].join("\n\n"),
    },
    returns: {
      slug: "returns",
      title: "Returns & Refunds",
      body: [
        "Items may be returned within 14 days of delivery, provided they're unused and in original packaging.",
        "To start a return, contact support with your order number.",
        "Refunds are issued to the original payment method once the returned item is received and inspected.",
        "Some items may not be eligible for return -- check the product page for details.",
      ].join("\n\n"),
    },
    privacy: {
      slug: "privacy",
      title: "Privacy Policy",
      body: [
        "We collect the information you provide when creating an account or placing an order (name, email, address, order history).",
        "This information is used to process orders, provide support, and improve our service -- it is not sold to third parties.",
        "Payment details are handled directly by our payment processor and are not stored on our servers.",
        "Contact us if you'd like to review, update, or delete the personal information we hold about you.",
      ].join("\n\n"),
    },
    terms: {
      slug: "terms",
      title: "Terms of Service",
      body: [
        "By using this site, you agree to provide accurate information and use the service lawfully.",
        "Product availability and pricing are subject to change without notice.",
        "We reserve the right to refuse or cancel orders in cases of suspected fraud or error.",
        "These terms may be updated periodically; continued use of the site constitutes acceptance of the current terms.",
      ].join("\n\n"),
    },
  },
  heroSlides: [],
};
