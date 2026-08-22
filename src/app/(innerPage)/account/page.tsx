import { getNotificationsData } from "@/lib/data";
import { Metadata } from "next";
import OverviewContent from "./overviewContent";

export const metadata: Metadata = {
    title: "My Account",
    description: "Manage your account and track your activity.",
};

const AccountOverview = async () => {
    const notifications = await getNotificationsData();
    const unreadCount = notifications.filter((n) => !n.read).length;

    return <OverviewContent unreadCount={unreadCount} />;
};

export default AccountOverview;
