'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { ButtonProps } from '@/types'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      children,
      onClick,
      type = 'button',
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

    const variants = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
      secondary:
        'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300',
      outline:
        'border border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
      ghost: 'text-primary-600 hover:bg-primary-50 active:bg-primary-100',
    }

    const sizes = {
      sm: 'h-9 px-3 text-sm rounded-md',
      md: 'h-10 px-4 text-sm rounded-md',
      lg: 'h-11 px-8 text-base rounded-lg',
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && 'cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading && <div className="spinner mr-2" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export default Button
