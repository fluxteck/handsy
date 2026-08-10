'use client'
import React, { ReactNode, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

type PropsType = {
    children: ReactNode
    className?: string
    /** Max vertical travel in px as the element passes through the viewport; higher = more depth. */
    strength?: number
}

/**
 * Subtle scroll-linked parallax for hero imagery / decorative elements.
 * Purely transform-based (GPU friendly, no layout writes) and disables
 * itself under prefers-reduced-motion.
 */
const Parallax = ({ children, className, strength = 30 }: PropsType) => {
    const ref = useRef<HTMLDivElement>(null)
    const prefersReducedMotion = useReducedMotion()
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    })
    const y = useTransform(scrollYProgress, [0, 1], [-strength, strength])

    return (
        <motion.div ref={ref} style={{ y: prefersReducedMotion ? 0 : y }} className={className}>
            {children}
        </motion.div>
    )
}

export default Parallax
