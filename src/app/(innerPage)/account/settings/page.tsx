import { getCustomerData } from "@/lib/data";
import { Metadata } from "next";
import SettingsContent from "./settingsContent";

export const metadata: Metadata = {
    title: "Account Settings",
    description: "Manage your profile, password and notification preferences.",
};

const SettingsPage = async () => {
    const customer = await getCustomerData();
    return <SettingsContent customer={customer} />;
};

export default SettingsPage;
