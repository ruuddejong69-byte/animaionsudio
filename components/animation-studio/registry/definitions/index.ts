/**
 * Component Definitions Index
 * 
 * Import and register all component definitions here.
 * This is the central place to add new components to the studio.
 * 
 * To add a new component:
 * 1. Create a definition file in this folder (e.g., my-component.ts)
 * 2. Import and export it below
 * 3. Add it to initializeComponents()
 */

import { registerComponent } from '../ComponentRegistry'
import { liquidToggleDefinition } from './liquid-toggle'
import { liquidCheckboxDefinition } from './liquid-checkbox'
import { liquidButtonDefinition } from './liquid-button'

/**
 * Initialize and register all component definitions
 * Call this function once at app startup
 */
export function initializeComponents() {
  console.log('[v0] Initializing component definitions...')
  
  // Register all components
  registerComponent(liquidToggleDefinition)
  registerComponent(liquidCheckboxDefinition)
  registerComponent(liquidButtonDefinition)
  
  console.log('[v0] All components registered successfully')
}

// Export individual definitions for direct access if needed
export { liquidToggleDefinition, liquidCheckboxDefinition, liquidButtonDefinition }
