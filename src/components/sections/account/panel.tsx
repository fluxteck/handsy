import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const Panel = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => (
    <div className={cn("rounded-2xl border border-border bg-background p-5 lg:p-6", className)}>
        {children}
    </div>
);

export const PanelHeading = ({
    title,
    description,
    action,
    className,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}) => (
    <div className={cn("mb-5 flex flex-wrap items-center justify-between gap-3", className)}>
        <div>
            <h2 className="text-xl font-medium text-secondary-foreground lg:text-2xl">{title}</h2>
            {description && <p className="mt-1 text-sm text-gray-1-foreground">{description}</p>}
        </div>
        {action}
    </div>
);

export const EmptyState = ({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    action?: ReactNode;
}) => (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-home-bg-1 px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-home-bg-2 text-gray-1-foreground">
            <Icon className="size-6" />
        </span>
        <p className="text-lg font-medium text-secondary-foreground">{title}</p>
        {description && <p className="max-w-sm text-sm text-gray-1-foreground">{description}</p>}
        {action}
    </div>
);
