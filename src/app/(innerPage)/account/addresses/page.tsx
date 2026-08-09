import { getAddressesData } from "@/lib/data";
import { Metadata } from "next";
import AddressesContent from "./addressesContent";

export const metadata: Metadata = {
    title: "Saved Addresses",
    description: "Manage your saved shipping addresses.",
};

const AddressesPage = async () => {
    const addresses = await getAddressesData();
    return <AddressesContent initialAddresses={addresses} />;
};

export default AddressesPage;
