import { AccountBreadcrumb } from "@/components/sections/account/accountBreadcrumb";
import { AccountSidebar } from "@/components/sections/account/accountSidebar";
import { getNotificationsData } from "@/lib/data";
import { NotificationType } from "@/types/accountType";
import { ReactNode } from "react";

const AccountLayout = async ({ children }: { children: ReactNode }) => {
    const notifications: NotificationType[] = await getNotificationsData();
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <main className="bg-home-bg-1">
            <AccountBreadcrumb />
            <div className="container pt-6 pb-15 lg:pt-10 lg:pb-25">
                <div className="flex items-start gap-6 lg:gap-8">
                    <AccountSidebar unreadCount={unreadCount} />
                    <div className="min-w-0 flex-1">{children}</div>
                </div>
            </div>
        </main>
    );
};

export default AccountLayout;
