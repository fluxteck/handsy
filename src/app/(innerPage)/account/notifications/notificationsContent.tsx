"use client";

import { EmptyState, Panel, PanelHeading } from "@/components/sections/account/panel";
import { Button } from "@/components/ui/button";
import { Heart } from "@/lib/icon";
import { cn } from "@/lib/utils";
import { NotificationCategory, NotificationType } from "@/types/accountType";
import { Bell, Gift, Package, ShieldCheck } from "lucide-react";
import { useState } from "react";

const categoryIcons: Record<NotificationCategory, React.ComponentType<{ className?: string }>> = {
    order: Package,
    offer: Gift,
    account: ShieldCheck,
    wishlist: Heart,
};

// No backend for notifications yet — read/unread state is managed locally.
// TODO: wire markAsRead/markAllAsRead to a real API once notifications are backed by a service.
const NotificationsContent = ({ initialNotifications }: { initialNotifications: NotificationType[] }) => {
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <Panel>
            <PanelHeading
                title="Notifications"
                description="Updates about your orders, offers and account."
                action={
                    unreadCount > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllAsRead}>
                            Mark all as read
                        </Button>
                    )
                }
            />
            {notifications.length ? (
                <div className="flex flex-col divide-y divide-border">
                    {notifications.map((notification) => {
                        const Icon = categoryIcons[notification.category];
                        return (
                            <button
                                key={notification.id}
                                type="button"
                                onClick={() => markAsRead(notification.id)}
                                className={cn(
                                    "flex w-full items-start gap-4 py-4 text-left transition-all duration-300 first:pt-0 last:pb-0 hover:opacity-70",
                                    !notification.read && "relative"
                                )}
                            >
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-home-bg-2 text-secondary-foreground">
                                    <Icon className="size-4" />
                                </span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p
                                            className={cn(
                                                "font-medium text-secondary-foreground",
                                                !notification.read && "pr-4"
                                            )}
                                        >
                                            {notification.title}
                                        </p>
                                        {!notification.read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-1-foreground">{notification.message}</p>
                                    <p className="mt-1 text-xs text-gray-3-foreground">
                                        {new Date(notification.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
            )}
        </Panel>
    );
};

export default NotificationsContent;
