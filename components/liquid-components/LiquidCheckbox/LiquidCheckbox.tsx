"use client"

import { useEffect, useId, useState } from 'react'

/**
 * Variant color schemes for the liquid checkbox
 */
export type LiquidCheckboxVariant = 'default' | 'success' | 'warning' | 'danger'

/**
 * Props for the LiquidCheckbox component
 */
export interface LiquidCheckboxProps {
  /** Controlled checked state */
  checked?: boolean
  /** Callback fired when checkbox state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Visual variant for color theming */
  variant?: LiquidCheckboxVariant
  /** Animation duration in milliseconds */
  duration?: number
  /** Animation timing function (CSS cubic-bezier) */
  timingFunction?: string
  /** Animation delay in milliseconds */
  delay?: number
  /** Primary color (overrides variant) */
  primaryColor?: string
  /** Secondary color (overrides variant) */
  secondaryColor?: string
  /** Disabled state */
  disabled?: boolean
  /** Accessible label */
  'aria-label'?: string
}

/**
 * Gooey SVG filter for liquid morphing effect
 * Must be rendered once in the DOM for the liquid effect to work
 */
export function GooeyFilter({ id }: { id: string }) {
  return (
    <svg className="absolute w-0 h-0">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="gooey"
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}

/**
 * Variant color configurations
 */
const variantColors: Record<LiquidCheckboxVariant, { primary: string; secondary: string }> = {
  default: { primary: '#3b82f6', secondary: '#e5e7eb' },
  success: { primary: '#10b981', secondary: '#e5e7eb' },
  warning: { primary: '#f59e0b', secondary: '#e5e7eb' },
  danger: { primary: '#ef4444', secondary: '#e5e7eb' }
}

/**
 * LiquidCheckbox - A checkbox with smooth liquid morphing animations
 * 
 * @example
 * ```tsx
 * <LiquidCheckbox 
 *   checked={isChecked}
 *   onCheckedChange={setIsChecked}
 *   variant="success"
 *   duration={500}
 * />
 * ```
 */
export function LiquidCheckbox({
  checked: externalChecked,
  onCheckedChange,
  variant = 'default',
  duration = 500,
  timingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  delay = 0,
  primaryColor,
  secondaryColor,
  disabled = false,
  'aria-label': ariaLabel
}: LiquidCheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(false)
  const filterId = useId()
  
  // Sync external checked state
  useEffect(() => {
    if (externalChecked !== undefined) {
      console.log('[v0] LiquidCheckbox: Syncing external checked state:', externalChecked)
      setInternalChecked(externalChecked)
    }
  }, [externalChecked])

  const isChecked = externalChecked !== undefined ? externalChecked : internalChecked

  const handleToggle = () => {
    if (disabled) return
    
    const newChecked = !isChecked
    console.log('[v0] LiquidCheckbox: Checkbox clicked, new state:', newChecked)
    
    if (externalChecked === undefined) {
      setInternalChecked(newChecked)
    }
    onCheckedChange?.(newChecked)
  }

  // Determine colors
  const colors = variantColors[variant]
  const activePrimary = primaryColor || colors.primary
  const activeSecondary = secondaryColor || colors.secondary

  return (
    <>
      <GooeyFilter id={filterId} />
      <button
        type="button"
        role="checkbox"
        aria-checked={isChecked}
        aria-label={ariaLabel || 'Checkbox'}
        disabled={disabled}
        onClick={handleToggle}
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: isChecked ? activePrimary : activeSecondary,
          backgroundColor: isChecked ? activePrimary : 'transparent',
          transitionProperty: 'background-color, border-color',
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: timingFunction,
          transitionDelay: `${delay}ms`,
          filter: `url(#${filterId})`
        }}
      >
        <svg
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
          style={{
            opacity: isChecked ? 1 : 0,
            transform: isChecked ? 'scale(1)' : 'scale(0.5)',
            transitionProperty: 'opacity, transform',
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: timingFunction,
            transitionDelay: `${delay}ms`
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </>
  )
}
