"use client"

import { useEffect, useId, useState } from 'react'

/**
 * Variant color schemes for the liquid toggle
 */
export type LiquidToggleVariant = 'default' | 'success' | 'warning' | 'danger'

/**
 * Props for the LiquidToggle component
 */
export interface LiquidToggleProps {
  /** Controlled checked state */
  checked?: boolean
  /** Callback fired when toggle state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Visual variant for color theming */
  variant?: LiquidToggleVariant
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
const variantColors: Record<LiquidToggleVariant, { primary: string; secondary: string }> = {
  default: { primary: '#3b82f6', secondary: '#dbeafe' },
  success: { primary: '#10b981', secondary: '#d1fae5' },
  warning: { primary: '#f59e0b', secondary: '#fef3c7' },
  danger: { primary: '#ef4444', secondary: '#fee2e2' }
}

/**
 * LiquidToggle - A toggle switch with smooth liquid morphing animations
 * 
 * @example
 * ```tsx
 * <LiquidToggle 
 *   checked={isOn}
 *   onCheckedChange={setIsOn}
 *   variant="success"
 *   duration={600}
 * />
 * ```
 */
export function LiquidToggle({
  checked: externalChecked,
  onCheckedChange,
  variant = 'default',
  duration = 600,
  timingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  delay = 0,
  primaryColor,
  secondaryColor,
  disabled = false,
  'aria-label': ariaLabel
}: LiquidToggleProps) {
  const [internalChecked, setInternalChecked] = useState(false)
  const filterId = useId()
  
  // Sync external checked state
  useEffect(() => {
    if (externalChecked !== undefined) {
      console.log('[v0] LiquidToggle: Syncing external checked state:', externalChecked)
      setInternalChecked(externalChecked)
    }
  }, [externalChecked])

  const isChecked = externalChecked !== undefined ? externalChecked : internalChecked

  const handleToggle = () => {
    if (disabled) return
    
    const newChecked = !isChecked
    console.log('[v0] LiquidToggle: Toggle clicked, new state:', newChecked)
    
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
        role="switch"
        aria-checked={isChecked}
        aria-label={ariaLabel || 'Toggle switch'}
        disabled={disabled}
        onClick={handleToggle}
        className="relative inline-flex h-10 w-20 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: isChecked ? activePrimary : activeSecondary,
          transitionProperty: 'background-color',
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: timingFunction,
          transitionDelay: `${delay}ms`,
          filter: `url(#${filterId})`
        }}
      >
        <span
          className="inline-block h-8 w-8 rounded-full bg-white"
          style={{
            transform: isChecked ? 'translateX(40px)' : 'translateX(4px)',
            transitionProperty: 'transform',
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: timingFunction,
            transitionDelay: `${delay}ms`
          }}
        />
      </button>
    </>
  )
}
