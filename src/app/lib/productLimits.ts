import { Product, SiteSettings } from "@/app/data/interFaces";

type LimitInputs = Pick<Product, "orderItemLimit"> & { stock: number };
type SettingsLimit = Pick<SiteSettings, "orderItemLimit">;

// A product's own order_item_limit wins when set; null/undefined falls back to the
// site-wide default. 0 (from either source) means unlimited.
export function effectiveOrderLimit(product: Pick<Product, "orderItemLimit">, settings: SettingsLimit): number {
  return product.orderItemLimit ?? settings.orderItemLimit;
}

export function maxAddableQuantity(product: LimitInputs, settings: SettingsLimit): number {
  const limit = effectiveOrderLimit(product, settings);
  return limit > 0 ? Math.min(product.stock, limit) : product.stock;
}

export function effectiveRefund(
  product: Pick<Product, "refundEnabled" | "refundDays">,
  settings: Pick<SiteSettings, "refundEnabled" | "refundDays">,
): { enabled: boolean; days: number } {
  return {
    enabled: product.refundEnabled ?? settings.refundEnabled,
    days: product.refundDays ?? settings.refundDays,
  };
}
