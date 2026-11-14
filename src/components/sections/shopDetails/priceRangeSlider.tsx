'use client'
import React, { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";
import currencyFormatter from "currency-formatter";

/**
 * Price filter.
 *
 * Bounds come from the live catalogue rather than a fixed 0–100, because a
 * slider whose top end sits below the cheapest product can only ever return
 * nothing. Values are in major units; the caller converts to the minor units
 * the API compares against.
 *
 * `onApply` fires on the Apply button, not on drag — every drag frame would
 * otherwise become a navigation.
 */
const PriceRangeSlider = ({
    min = 0,
    max = 100,
    value,
    currency = "USD",
    onApply,
}: {
    min?: number
    max?: number
    value?: [number, number]
    currency?: string
    onApply?: (range: [number, number]) => void
} = {}) => {
    const minLimit = min;
    // react-range throws if max <= min, which happens on an empty or
    // single-price catalogue.
    const maxLimit = max > min ? max : min + 1;

    const clamp = (v: number) => Math.min(maxLimit, Math.max(minLimit, v));
    const applied: [number, number] = [clamp(value?.[0] ?? minLimit), clamp(value?.[1] ?? maxLimit)];
    const [values, setValues] = useState<number[]>(applied);

    // Re-sync when the URL (and so the incoming value) changes.
    useEffect(() => {
        setValues([clamp(value?.[0] ?? minLimit), clamp(value?.[1] ?? maxLimit)]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value?.[0], value?.[1], minLimit, maxLimit]);

    const format = (amount: number) =>
        currencyFormatter.format(amount, { code: currency || "USD", precision: 0 });
    const low = values[0] ?? minLimit;
    const high = values[1] ?? maxLimit;
    const isDirty = low !== applied[0] || high !== applied[1];

    return (
        // Padding keeps the 18px thumbs clear of the accordion's overflow clip at both ends.
        <div className="w-full px-3 pt-2">
            <Range
                step={1}
                min={minLimit}
                max={maxLimit}
                values={values}
                onChange={(newValues) => setValues(newValues)}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        className="h-1 w-full rounded-full"
                        style={{
                            ...props.style,
                            // Selected span in the primary colour, the rest muted.
                            background: getTrackBackground({
                                values,
                                colors: ["var(--gray-2)", "var(--primary)", "var(--gray-2)"],
                                min: minLimit,
                                max: maxLimit,
                            }),
                        }}
                    >
                        {children}
                    </div>
                )}
                renderThumb={({ props, index }) => {
                    const { key, ...restProps } = props;
                    return (
                        <div
                            key={key}
                            {...restProps}
                            aria-label={index === 0 ? "Minimum price" : "Maximum price"}
                            aria-valuetext={format(values[index] ?? 0)}
                            className="size-[18px] rounded-full border-2 border-primary bg-background shadow-sm outline-none transition-shadow focus-visible:ring-4 focus-visible:ring-primary/15"
                            style={restProps.style}
                        />
                    );
                }}
            />
            <div className="mt-5 flex items-center gap-2 text-sm">
                <span className="flex-1 rounded-lg bg-home-bg-1 px-3 py-2">
                    <span className="block text-[11px] uppercase tracking-wide text-gray-3-foreground">Min</span>
                    <span className="text-secondary-foreground">{format(low)}</span>
                </span>
                <span aria-hidden className="text-gray-3-foreground">–</span>
                <span className="flex-1 rounded-lg bg-home-bg-1 px-3 py-2">
                    <span className="block text-[11px] uppercase tracking-wide text-gray-3-foreground">Max</span>
                    <span className="text-secondary-foreground">{format(high)}</span>
                </span>
            </div>
            <button
                type="button"
                disabled={!isDirty}
                onClick={() => onApply?.([low, high])}
                className='mt-3 w-full rounded-full border border-primary py-2 text-sm font-medium text-secondary-foreground transition-colors duration-300 hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-40'
            >Apply price</button>
        </div>
    );
};

export default PriceRangeSlider;
