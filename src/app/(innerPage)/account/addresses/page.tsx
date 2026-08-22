import { Metadata } from "next";
import AddressesContent from "./addressesContent";

export const metadata: Metadata = {
    title: "Saved Addresses",
    description: "Manage your saved shipping addresses.",
};

const AddressesPage = () => {
    return <AddressesContent />;
};

export default AddressesPage;
