'use client'
import React, { useEffect, useState } from "react";
import { Range } from "react-range";
import currencyFormatter from "currency-formatter";

/**
 * Price filter.
 *
 * Bounds come from the live catalogue rather than a fixed 0–100, because a
 * slider whose top end sits below the cheapest product can only ever return
 * nothing. Values are in major units; the caller converts to the minor units
 * the API compares against.
 *
 * `onApply` fires on the Filter button, not on drag — every drag frame would
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
    const [values, setValues] = useState<number[]>([
        clamp(value?.[0] ?? minLimit),
        clamp(value?.[1] ?? maxLimit),
    ]);

    // Re-sync when the URL (and so the incoming value) changes.
    useEffect(() => {
        setValues([clamp(value?.[0] ?? minLimit), clamp(value?.[1] ?? maxLimit)]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value?.[0], value?.[1], minLimit, maxLimit]);

    const format = (amount: number) =>
        currencyFormatter.format(amount, { code: currency || "USD", precision: 0 });

    return (
        <div className="w-full mt-5">
            <Range
                step={1}
                min={minLimit}
                max={maxLimit}
                values={values}
                onChange={(newValues) => setValues(newValues)}
                renderTrack={({ props, children }) => {
                    // Destructure key from props to avoid the warning
                    const { ...restProps } = props;
                    return (
                        <div
                            key={1}
                            {...restProps}
                            style={{
                                ...restProps.style,
                                height: "2px",
                                width: "100%",
                                background: "#4D4C4B",
                            }}
                        >
                            {children}
                        </div>
                    );
                }}
                renderThumb={({ props }) => {
                    // Destructure key from props to avoid the warning
                    const { key, ...restProps } = props;
                    return (
                        <div
                        key={key}
                            {...restProps}
                            style={{
                                ...restProps.style,
                                height: "8px",
                                width: "8px",
                                backgroundColor: "#4D4C4B",
                                borderRadius: "none",
                            }}
                        />
                    );
                }}
            />
            <div className="flex justify-between items-center mt-5">
                <div>
                    <span className='text-gray-1-foreground'>Price:</span>
                    <p className="border border-primary py-1 px-4 inline-flex gap-3 ml-2 text-secondary-foreground rounded-sm">{format(values[0] ?? minLimit)} - {format(values[1] ?? maxLimit)}</p>
                </div>
                <button
                    type="button"
                    onClick={() => onApply?.([values[0] ?? minLimit, values[1] ?? maxLimit])}
                    className='px-4 py-1 bg-primary text-white leading-[162%] text-base rounded-[4px]'
                >Filter</button>
            </div>
        </div>
    );
};

export default PriceRangeSlider;
