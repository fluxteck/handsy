import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export type TrustBadgeItem = {
    icon: LucideIcon
    label: string
}

// Fills the space normally occupied by the social-login row while it's hidden (see config.ts).
// Same badge language as the product page's UspMarquee (circular icon chip + label), just laid
// out as a calm static list instead of a marquee, which suits this narrow card better.
const TrustBadges = ({ items, className }: { items: TrustBadgeItem[]; className?: string }) => (
    <div className={cn('flex flex-col gap-3', className)}>
        {items.map(({ icon: Icon, label }, index) => (
            <div key={index} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-home-bg-2 text-gray-1-foreground">
                    <Icon className="size-4" strokeWidth={1.5} />
                </span>
                <span className="text-sm text-gray-1-foreground">{label}</span>
            </div>
        ))}
    </div>
)

export default TrustBadges
