/**
 * Animation Studio - Public API
 * 
 * This module exports the main AnimationStudio component and utilities
 * for registering custom animatable components.
 */

export { AnimationStudio } from './AnimationStudio'
export { registerComponent, getAllComponents, getComponent } from './registry/ComponentRegistry'
export { initializeComponents } from './registry/definitions'
export type { 
  ComponentDefinition, 
  PropSchema, 
  PropConfig, 
  AnimationConfig,
  GeneratedCode 
} from './core/types'
