/**
 * Core type definitions for the Animation Studio
 * 
 * This module defines the interfaces and types that enable the animation studio
 * to work with any animatable component in a type-safe, extensible way.
 */

import type { ComponentType, ReactNode } from 'react'

/**
 * Supported prop types for component properties
 */
export type PropType = 
  | 'number' 
  | 'string' 
  | 'boolean' 
  | 'color' 
  | 'bezier' 
  | 'select'
  | 'range'

/**
 * Configuration for a single component prop
 * Defines how the prop should be edited in the studio UI
 */
export interface PropConfig {
  /** Display label in the UI */
  label: string
  /** Type of prop (determines which editor to show) */
  type: PropType
  /** Default value */
  defaultValue: any
  /** Minimum value (for number/range types) */
  min?: number
  /** Maximum value (for number/range types) */
  max?: number
  /** Step increment (for number/range types) */
  step?: number
  /** Available options (for select type) */
  options?: Array<{ label: string; value: any }>
  /** Description/tooltip text */
  description?: string
  /** Whether this prop affects animation timing */
  isAnimationProp?: boolean
  /** Custom validation function */
  validate?: (value: any) => boolean
  /** Transform value before code generation */
  transform?: (value: any) => string
}

/**
 * Complete prop schema for a component
 * Maps prop names to their configurations
 */
export interface PropSchema {
  [propName: string]: PropConfig
}

/**
 * State mode determines how the component handles interactive state
 * - 'toggle': Uses checked/onCheckedChange (checkboxes, switches)
 * - 'button': Uses loading/success states (buttons)
 */
export type StateMode = 'toggle' | 'button'

/**
 * Configuration for registering an animatable component
 * Provides all metadata needed for the studio to work with the component
 */
export interface ComponentDefinition {
  /** Unique identifier for the component */
  id: string
  /** Display name in the UI */
  name: string
  /** Brief description of the component */
  description: string
  /** The actual React component */
  component: ComponentType<any>
  /** Schema defining all editable props */
  propSchema: PropSchema
  /** Default prop values */
  defaultProps: Record<string, any>
  /** How the component handles interactive state */
  stateMode?: StateMode
  /** Category for grouping (e.g., 'forms', 'feedback', 'navigation') */
  category?: string
  /** Tags for search/filtering */
  tags?: string[]
  /** Import path for code generation */
  importPath: string
  /** Additional imports needed (e.g., types, utilities) */
  additionalImports?: Array<{ name: string; path: string; isType?: boolean }>
  /** Custom code template for component definition */
  componentCode?: string
  /** Preview wrapper component (for components that need context) */
  previewWrapper?: ComponentType<{ children: ReactNode }>
}

/**
 * Current animation configuration state
 * Tracks all prop values being edited in the studio
 */
export interface AnimationConfig {
  /** Current component ID */
  componentId: string
  /** Current prop values */
  props: Record<string, any>
  /** Whether component is in checked/active state (for interactive components) */
  isActive: boolean
}

/**
 * Bezier curve control point
 */
export interface BezierPoint {
  x: number
  y: number
}

/**
 * Bezier curve definition (cubic-bezier)
 */
export interface BezierCurve {
  /** First control point */
  p1: BezierPoint
  /** Second control point */
  p2: BezierPoint
}

/**
 * Preset bezier curves (common easing functions)
 */
export const BEZIER_PRESETS: Record<string, BezierCurve> = {
  linear: { p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 } },
  ease: { p1: { x: 0.25, y: 0.1 }, p2: { x: 0.25, y: 1 } },
  'ease-in': { p1: { x: 0.42, y: 0 }, p2: { x: 1, y: 1 } },
  'ease-out': { p1: { x: 0, y: 0 }, p2: { x: 0.58, y: 1 } },
  'ease-in-out': { p1: { x: 0.42, y: 0 }, p2: { x: 0.58, y: 1 } },
  'ease-in-back': { p1: { x: 0.36, y: 0 }, p2: { x: 0.66, y: -0.56 } },
  'ease-out-back': { p1: { x: 0.34, y: 1.56 }, p2: { x: 0.64, y: 1 } },
  'ease-in-out-back': { p1: { x: 0.68, y: -0.6 }, p2: { x: 0.32, y: 1.6 } }
}

/**
 * Code generation options
 */
export interface CodeGenerationOptions {
  /** Whether to include TypeScript types */
  includeTypes: boolean
  /** Whether to include imports */
  includeImports: boolean
  /** Whether to format with Prettier (if available) */
  format: boolean
  /** Target syntax (tsx, jsx) */
  syntax: 'tsx' | 'jsx'
}

/**
 * Generated code output
 */
export interface GeneratedCode {
  /** The component definition code */
  componentCode: string
  /** Usage example with configured props */
  usageCode: string
  /** CSS-only version (if applicable) */
  cssCode?: string
  /** Import statements */
  imports: string[]
}
