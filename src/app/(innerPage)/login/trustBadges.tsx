import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export type TrustBadgeItem = {
    icon: LucideIcon
    label: string
}

// Fills the space normally occupied by the social-login row while it's hidden (see config.ts).
// Same trust-indicator recipe as the PDP's "Need Help in Buying?" card (needHelp.tsx) — a
// divided 3-column grid of outlined icon circles with a tiny centered label — reused as-is so
// this reads as the same design system, not a one-off.
const TrustBadges = ({ items, className }: { items: TrustBadgeItem[]; className?: string }) => (
    <ul className={cn('grid grid-cols-3 divide-x divide-gray-2', className)}>
        {items.map(({ icon: Icon, label }, index) => (
            <li
                key={index}
                className="flex flex-col items-center gap-1.5 px-1 text-center transition-transform duration-300 hover:-translate-y-0.5"
            >
                <span className="flex size-9 items-center justify-center rounded-full border border-gray-2 text-gray-1-foreground transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-white">
                    <Icon className="size-3.5" strokeWidth={1.5} />
                </span>
                <span className="text-[10px] font-medium leading-tight text-gray-1-foreground">{label}</span>
            </li>
        ))}
    </ul>
)

export default TrustBadges
