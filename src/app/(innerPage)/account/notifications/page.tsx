import { getNotificationsData } from "@/lib/data";
import { Metadata } from "next";
import NotificationsContent from "./notificationsContent";

export const metadata: Metadata = {
    title: "Notifications",
    description: "Stay up to date with your orders, offers and account activity.",
};

const NotificationsPage = async () => {
    const notifications = await getNotificationsData();
    return <NotificationsContent initialNotifications={notifications} />;
};

export default NotificationsPage;
