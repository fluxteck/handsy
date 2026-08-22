import { Metadata } from "next";
import SettingsContent from "./settingsContent";

export const metadata: Metadata = {
    title: "Account Settings",
    description: "Manage your profile, password and notification preferences.",
};

const SettingsPage = () => {
    return <SettingsContent />;
};

export default SettingsPage;
