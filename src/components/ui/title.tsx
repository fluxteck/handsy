import React from 'react'
import { cn } from '@/lib/utils'

type TitleProps = {
    className?: string;
    children: React.ReactNode;
}
const Title = ({ className, children }: TitleProps) => {
    return (
        <h2 className={cn('text-secondary-foreground text-heading capitalize', className)}>{children}</h2>
    )
}

export default Title