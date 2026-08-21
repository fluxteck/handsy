import { cn } from "@/lib/utils";
import currencyFormatter from "currency-formatter";

export type CartRewardMilestone = {
  amount: number;
  label: string;
};

const defaultMilestones: CartRewardMilestone[] = [
  { amount: 1499, label: "Free Product" },
  { amount: 2299, label: "Free Gift" },
  { amount: 4999, label: "Free Gift" },
];

const formatAmount = (amount: number) =>
  currencyFormatter.format(amount, { code: "USD" });

/**
 * Cart-drawer progress bar toward spend-based reward milestones. Purely presentational —
 * takes the cart subtotal and renders how far the customer is from each milestone, so it
 * has no dependency on redux and can be unit-tested/reused on its own.
 */
const CartRewardsProgress = ({
  subtotal,
  milestones = defaultMilestones,
  className,
}: {
  subtotal: number;
  milestones?: CartRewardMilestone[];
  className?: string;
}) => {
  const maxAmount = milestones[milestones.length - 1]?.amount ?? 0;
  const progressPct = maxAmount > 0 ? Math.min((subtotal / maxAmount) * 100, 100) : 100;
  const nextMilestone = milestones.find((milestone) => subtotal < milestone.amount);

  return (
    <div className={cn("rounded-xl bg-home-bg-1 px-5 py-4", className)}>
      <p className="text-sm text-secondary-foreground">
        {nextMilestone ? (
          <>
            Add{" "}
            <span className="font-semibold">
              {formatAmount(nextMilestone.amount - subtotal)}
            </span>{" "}
            more to unlock{" "}
            <span className="font-semibold">{nextMilestone.label}</span>
          </>
        ) : (
          <span className="font-semibold">
            🎉 You&apos;ve unlocked every reward on this order!
          </span>
        )}
      </p>

      <div className="relative mt-4 h-1.5 rounded-full bg-background">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${progressPct}%` }}
        />
        {milestones.map((milestone) => {
          const achieved = subtotal >= milestone.amount;
          const markerPct = maxAmount > 0 ? (milestone.amount / maxAmount) * 100 : 0;
          return (
            <span
              key={milestone.amount}
              aria-hidden
              className={cn(
                "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 rounded-full border-2 border-background transition-colors duration-500",
                achieved ? "bg-primary" : "bg-gray-2"
              )}
              style={{ left: `${markerPct}%` }}
            />
          );
        })}
      </div>

      <ul className="mt-2.5 flex items-start justify-between text-xs text-gray-1-foreground">
        {milestones.map((milestone) => {
          const achieved = subtotal >= milestone.amount;
          const isLast = milestone.amount === maxAmount;
          return (
            <li
              key={milestone.amount}
              className={cn(
                "flex flex-col gap-0.5",
                isLast ? "items-end text-right" : milestone.amount === milestones[0].amount ? "items-start text-left" : "items-center text-center"
              )}
            >
              <span className={cn(achieved && "text-secondary-foreground font-medium")}>
                {formatAmount(milestone.amount)}
              </span>
              <span className={cn(achieved && "text-secondary-foreground")}>{milestone.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CartRewardsProgress;
