import type {
  Address,
  Customer,
  Order,
  OrderStatus as SdkOrderStatus,
  Review,
} from "@commercekitsdk/core";
import type {
  AddressType,
  CustomerReviewType,
  CustomerType,
  OrderStatus,
  OrderType,
} from "@/types/accountType";
import { safeImageUrl } from "../images";

/**
 * SDK account types → the template's shapes, so the account screens keep their
 * markup.
 */

const FALLBACK_IMAGE = "/images/home-1/featured-products/img-1.webp";

/** Minor units → major. */
const toMajor = (amount: number): number => amount / 100;

/**
 * The SDK's lifecycle vs the template's.
 *
 * The template's badge only knows five states, and they describe *delivery*
 * progress. The SDK's describe *order* lifecycle, so the mapping is lossy on
 * purpose:
 *   - `pending` (awaiting payment, e.g. COD) and `paid` both read as
 *     "processing" — nothing has shipped yet either way.
 *   - `fulfilled` means it left the warehouse → "shipped".
 *   - refunded has no template equivalent; "cancelled" is the closest
 *     truthful thing to show a customer.
 */
const STATUS_MAP: Record<string, OrderStatus> = {
  pending: "processing",
  paid: "processing",
  fulfilled: "shipped",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
  canceled: "cancelled",
  refunded: "cancelled",
};

function toOrderStatus(status: SdkOrderStatus | string, hasDelivered: boolean): OrderStatus {
  if (hasDelivered) return "delivered";
  return STATUS_MAP[status] ?? "processing";
}

/** `Address` → the one-line string the order screens print. */
function formatAddress(address: Address | null): string {
  if (!address) return "";
  return [
    [address.firstName, address.lastName].filter(Boolean).join(" "),
    address.line1,
    address.line2,
    address.city,
    address.region,
    address.postalCode,
    address.country,
  ]
    .filter((part) => part && String(part).trim())
    .join(", ");
}

/** ISO → `YYYY-MM-DD`, which is what the template's date helpers expect. */
function toDateOnly(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export function toOrderType(order: Order): OrderType {
  const shipment = order.shipments?.[0];
  const delivered = order.shipments?.some((s) => s.status === "delivered") ?? false;

  /*
   * The template renders a fixed four-step tracker. The SDK models shipments
   * instead, so the steps are derived: "placed" is always true, and the rest
   * light up from order status and shipment state. Dates are only shown for
   * steps we can actually evidence.
   */
  const isShipped = order.status === "fulfilled" || Boolean(shipment);
  const tracking = [
    { label: "Order placed", date: toDateOnly(order.createdAt), completed: true },
    {
      label: "Processing",
      date: order.payment ? toDateOnly(order.createdAt) : "",
      completed: order.status !== "pending" || Boolean(order.payment),
    },
    {
      label: "Shipped",
      date: shipment?.shippedAt ? toDateOnly(shipment.shippedAt) : "",
      completed: isShipped,
    },
    {
      label: "Delivered",
      date: shipment?.deliveredAt ? toDateOnly(shipment.deliveredAt) : "",
      completed: delivered,
    },
  ];

  return {
    /* `id` must stay the real order id: it routes to /account/orders/[id] and
       is what `orders.get` expects. Using the human number here made the link
       `/account/orders/#101`, where the `#` becomes a URL fragment and the
       detail page is never reached. */
    id: String(order.id),
    number: order.number || String(order.id),
    placedOn: toDateOnly(order.createdAt),
    status: toOrderStatus(order.status, delivered),
    total: toMajor(order.totals.total.amount),
    paymentMethod: order.payment
      ? `${order.payment.provider}${order.payment.reference ? ` ····${order.payment.reference.slice(-4)}` : ""}`
      : "Cash on delivery",
    shippingAddress: formatAddress(order.shippingAddress),
    items: order.items.map((item) => ({
      productId: String(item.productId),
      title: item.title,
      thumbnail: safeImageUrl(item.imageUrl, FALLBACK_IMAGE),
      price: toMajor(item.unitPrice.amount),
      quantity: item.quantity,
    })),
    tracking,
    ...(shipment?.trackingNumber ? { trackingNumber: shipment.trackingNumber } : {}),
  };
}

export function toOrderTypes(orders: Order[]): OrderType[] {
  return orders.map(toOrderType);
}

export function toAddressType(address: Address): AddressType {
  return {
    id: String(address.id),
    // The SDK has no address label; the template shows one, so fall back to
    // something truthful rather than inventing "Home".
    label: address.company || (address.isDefault ? "Default" : "Address"),
    fullName: [address.firstName, address.lastName].filter(Boolean).join(" "),
    phone: address.phone ?? "",
    line1: address.line1,
    line2: address.line2 ?? "",
    city: address.city,
    state: address.region,
    postalCode: address.postalCode,
    country: address.country,
    isDefault: address.isDefault,
  };
}

export function toAddressTypes(addresses: Address[]): AddressType[] {
  return addresses.map(toAddressType);
}

export function toCustomerType(customer: Customer): CustomerType {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ");
  return {
    id: String(customer.id),
    name: name || customer.email.split("@")[0] || "",
    email: customer.email,
    phone: customer.phone ?? "",
    avatar: "",
    // Reaching the account at all means the email OTP was verified.
    verified: true,
    memberSince: toDateOnly(customer.createdAt),
  };
}

/**
 * SDK `Review` → the template's `CustomerReviewType`, for the "my reviews"
 * screen.
 *
 * `review.product` is populated by the server's by-customer query, so the
 * title and image are already here — no per-review product fetch.
 */
export function toCustomerReviewType(review: Review): CustomerReviewType {
  return {
    id: String(review.id),
    productId: String(review.productId),
    productTitle: review.product?.title ?? "Product",
    thumbnail: safeImageUrl(review.product?.imageUrl, FALLBACK_IMAGE),
    rating: review.rating,
    comment: review.body,
    date: toDateOnly(review.createdAt),
    ...(review.product?.slug ? { slug: review.product.slug } : {}),
    ...(review.status ? { status: review.status } : {}),
  };
}

export function toCustomerReviewTypes(reviews: Review[]): CustomerReviewType[] {
  return reviews.map(toCustomerReviewType);
}
