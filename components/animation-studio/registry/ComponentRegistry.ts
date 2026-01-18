/**
 * Component Registry - Central registry for all animatable components
 * 
 * This module provides a plugin-based architecture where new components can be
 * registered dynamically. It acts as the single source of truth for all components
 * available in the animation studio.
 * 
 * @example
 * ```ts
 * // Register a new component
 * registerComponent({
 *   id: 'liquid-button',
 *   name: 'Liquid Button',
 *   component: LiquidButton,
 *   propSchema: { ... },
 *   defaultProps: { ... },
 *   importPath: '@/components/liquid-components/LiquidButton'
 * })
 * 
 * // Retrieve a component
 * const buttonDef = getComponent('liquid-button')
 * ```
 */

import type { ComponentDefinition } from '../core/types'

/**
 * Internal registry storage
 * Maps component IDs to their definitions
 */
const componentRegistry = new Map<string, ComponentDefinition>()

/**
 * Register a new animatable component
 * 
 * @param definition - Complete component definition
 * @throws Error if component ID already exists
 */
export function registerComponent(definition: ComponentDefinition): void {
  console.log('[v0] ComponentRegistry: Registering component:', definition.id)
  
  if (componentRegistry.has(definition.id)) {
    throw new Error(`Component with ID "${definition.id}" is already registered`)
  }
  
  // Validate definition
  if (!definition.component) {
    throw new Error(`Component definition for "${definition.id}" is missing the component property`)
  }
  
  if (!definition.propSchema) {
    throw new Error(`Component definition for "${definition.id}" is missing propSchema`)
  }
  
  componentRegistry.set(definition.id, definition)
  console.log('[v0] ComponentRegistry: Successfully registered:', definition.id)
}

/**
 * Unregister a component by ID
 * Useful for hot module replacement or testing
 * 
 * @param id - Component ID to unregister
 * @returns true if component was found and removed
 */
export function unregisterComponent(id: string): boolean {
  console.log('[v0] ComponentRegistry: Unregistering component:', id)
  return componentRegistry.delete(id)
}

/**
 * Get a component definition by ID
 * 
 * @param id - Component ID
 * @returns Component definition or undefined if not found
 */
export function getComponent(id: string): ComponentDefinition | undefined {
  return componentRegistry.get(id)
}

/**
 * Get all registered components
 * 
 * @returns Array of all component definitions
 */
export function getAllComponents(): ComponentDefinition[] {
  return Array.from(componentRegistry.values())
}

/**
 * Get components by category
 * 
 * @param category - Category name
 * @returns Array of matching component definitions
 */
export function getComponentsByCategory(category: string): ComponentDefinition[] {
  return getAllComponents().filter(def => def.category === category)
}

/**
 * Get components by tag
 * 
 * @param tag - Tag to search for
 * @returns Array of matching component definitions
 */
export function getComponentsByTag(tag: string): ComponentDefinition[] {
  return getAllComponents().filter(def => def.tags?.includes(tag))
}

/**
 * Search components by name or description
 * 
 * @param query - Search query
 * @returns Array of matching component definitions
 */
export function searchComponents(query: string): ComponentDefinition[] {
  const lowercaseQuery = query.toLowerCase()
  return getAllComponents().filter(def => 
    def.name.toLowerCase().includes(lowercaseQuery) ||
    def.description.toLowerCase().includes(lowercaseQuery) ||
    def.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

/**
 * Get all unique categories
 * 
 * @returns Array of category names
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>()
  getAllComponents().forEach(def => {
    if (def.category) {
      categories.add(def.category)
    }
  })
  return Array.from(categories).sort()
}

/**
 * Check if a component is registered
 * 
 * @param id - Component ID
 * @returns true if component exists
 */
export function hasComponent(id: string): boolean {
  return componentRegistry.has(id)
}

/**
 * Clear all registered components
 * Useful for testing or resetting the registry
 */
export function clearRegistry(): void {
  console.log('[v0] ComponentRegistry: Clearing all components')
  componentRegistry.clear()
}
