import type { ElementType } from "react";
import { Sofa, Lamp, Frame, UtensilsCrossed, Gem, Building2 } from "lucide-react";

/**
 * Purely presentational per-category icons — menuList stays data-only, so
 * unmapped labels fall back to a generic tag icon (see each call site).
 * Shared between the mobile drawer and the desktop navbar dropdown so both
 * surfaces use the same icon for the same category.
 */
export const categoryIcons: Record<string, ElementType> = {
  Furniture: Sofa,
  Lighting: Lamp,
  Decor: Frame,
  "Kitchen & Dining": UtensilsCrossed,
  Luxury: Gem,
  B2B: Building2,
};
