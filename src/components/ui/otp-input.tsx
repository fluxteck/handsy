"use client"

import { cn } from "@/lib/utils"
import { useRef } from "react"

export const OtpInput = ({
    length = 6,
    value,
    onChange,
    disabled,
    className,
    inputClassName,
}: {
    length?: number
    value: string[]
    onChange: (value: string[]) => void
    disabled?: boolean
    className?: string
    inputClassName?: string
}) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, raw: string) => {
        const digit = raw.replace(/\D/g, "").slice(-1)
        const next = [...value]
        next[index] = digit
        onChange(next)
        if (digit && index < length - 1) inputsRef.current[index + 1]?.focus()
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            inputsRef.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
        if (!pasted) return
        e.preventDefault()
        onChange(Array.from({ length }, (_, i) => pasted[i] ?? ""))
        inputsRef.current[Math.min(pasted.length, length - 1)]?.focus()
    }

    return (
        <div className={cn("flex items-center justify-between gap-2", className)} onPaste={handlePaste}>
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputsRef.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={value[index] ?? ""}
                    disabled={disabled}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    aria-label={`Digit ${index + 1}`}
                    className={cn(
                        "h-12 w-full min-w-0 rounded-xl border text-center text-lg font-medium outline-none transition-colors duration-200 disabled:opacity-50",
                        inputClassName
                    )}
                />
            ))}
        </div>
    )
}
