"use client"

import React from "react"

import { useId, useState } from 'react'

/**
 * Variant color schemes for the liquid button
 */
export type LiquidButtonVariant = 'default' | 'success' | 'warning' | 'danger'

/**
 * Props for the LiquidButton component
 * 
 * This button features smooth liquid animations for state transitions,
 * including loading, success, and error states with gooey morphing effects.
 */
export interface LiquidButtonProps {
  /** Button text content */
  children?: React.ReactNode
  /** Loading state - shows spinner with liquid animation */
  loading?: boolean
  /** Success state - shows checkmark with liquid animation */
  success?: boolean
  /** Visual variant for color theming */
  variant?: LiquidButtonVariant
  /** Animation duration in milliseconds */
  duration?: number
  /** Animation timing function (CSS cubic-bezier) */
  timingFunction?: string
  /** Animation delay in milliseconds */
  delay?: number
  /** Primary color (overrides variant) */
  primaryColor?: string
  /** Secondary color for hover/loading states (overrides variant) */
  secondaryColor?: string
  /** Disabled state */
  disabled?: boolean
  /** Click handler */
  onClick?: () => void
  /** Accessible label */
  'aria-label'?: string
}

/**
 * Gooey SVG filter for liquid morphing effect
 */
function GooeyFilter({ id }: { id: string }) {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
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
const variantColors: Record<LiquidButtonVariant, { primary: string; secondary: string; text: string }> = {
  default: { primary: '#3b82f6', secondary: '#2563eb', text: '#ffffff' },
  success: { primary: '#10b981', secondary: '#059669', text: '#ffffff' },
  warning: { primary: '#f59e0b', secondary: '#d97706', text: '#000000' },
  danger: { primary: '#ef4444', secondary: '#dc2626', text: '#ffffff' }
}

/**
 * Loading spinner component with liquid animation
 */
function LoadingSpinner({ color, duration, timingFunction }: { color: string; duration: number; timingFunction: string }) {
  return (
    <svg
      className="animate-spin"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        animationDuration: `${duration}ms`,
        animationTimingFunction: timingFunction
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="60"
        strokeDashoffset="45"
        opacity={0.8}
      />
    </svg>
  )
}

/**
 * Success checkmark component
 */
function SuccessCheck({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

/**
 * LiquidButton - A button with smooth liquid morphing animations for state transitions
 * 
 * Features loading and success states with gooey effects for visual feedback.
 * 
 * @example
 * ```tsx
 * const [loading, setLoading] = useState(false)
 * const [success, setSuccess] = useState(false)
 * 
 * <LiquidButton 
 *   loading={loading}
 *   success={success}
 *   variant="success"
 *   duration={400}
 *   onClick={handleSubmit}
 * >
 *   Submit
 * </LiquidButton>
 * ```
 */
export function LiquidButton({
  children = 'Submit',
  loading = false,
  success = false,
  variant = 'default',
  duration = 400,
  timingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  delay = 0,
  primaryColor,
  secondaryColor,
  disabled = false,
  onClick,
  'aria-label': ariaLabel
}: LiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const filterId = useId()

  // Determine colors
  const colors = variantColors[variant]
  const activePrimary = primaryColor || colors.primary
  const activeSecondary = secondaryColor || colors.secondary
  const textColor = colors.text

  // Calculate current background based on state
  const currentBg = loading || success 
    ? activeSecondary 
    : isHovered 
      ? activeSecondary 
      : activePrimary

  // Determine what to show inside button
  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner color={textColor} duration={duration * 2} timingFunction={timingFunction} />
    }
    if (success) {
      return <SuccessCheck color={textColor} />
    }
    return children
  }

  return (
    <>
      <GooeyFilter id={filterId} />
      <button
        type="button"
        disabled={disabled || loading}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={ariaLabel || (typeof children === 'string' ? children : 'Button')}
        aria-busy={loading}
        className="relative inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium min-w-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed"
        style={{
          backgroundColor: currentBg,
          color: textColor,
          opacity: disabled && !loading ? 0.5 : 1,
          transitionProperty: 'background-color, transform, opacity',
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: timingFunction,
          transitionDelay: `${delay}ms`,
          filter: `url(#${filterId})`,
          transform: isHovered && !loading && !success ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        <span
          style={{
            opacity: loading || success ? 0 : 1,
            transitionProperty: 'opacity',
            transitionDuration: `${duration / 2}ms`,
            transitionTimingFunction: timingFunction
          }}
        >
          {children}
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: loading || success ? 1 : 0,
            transitionProperty: 'opacity',
            transitionDuration: `${duration / 2}ms`,
            transitionTimingFunction: timingFunction
          }}
        >
          {loading && <LoadingSpinner color={textColor} duration={duration * 2} timingFunction={timingFunction} />}
          {success && !loading && <SuccessCheck color={textColor} />}
        </span>
      </button>
    </>
  )
}
