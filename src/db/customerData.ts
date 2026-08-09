import { CustomerType } from "@/types/accountType";

// TODO: replace with the authenticated customer once real auth/session exists.
export const customerData: CustomerType = {
  id: "cus_10234",
  name: "Mohd Mohsin",
  email: "mohsin@example.com",
  phone: "+91 98765 43210",
  // No real photo asset in the project yet — UI falls back to initials when empty.
  avatar: "",
  verified: true,
  memberSince: "March 2023",
};
