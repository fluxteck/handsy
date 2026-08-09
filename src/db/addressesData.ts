import { AddressType } from "@/types/accountType";

export const addressesData: AddressType[] = [
  {
    id: "addr_1",
    label: "Home",
    fullName: "Mohd Mohsin",
    phone: "+91 98765 43210",
    line1: "204, Palm Residency",
    line2: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400050",
    country: "India",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "Office",
    fullName: "Mohd Mohsin",
    phone: "+91 98765 43210",
    line1: "12th Floor, Crescent Business Park",
    line2: "Powai",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400076",
    country: "India",
    isDefault: false,
  },
];
