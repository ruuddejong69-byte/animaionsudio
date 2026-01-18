/**
 * Code Generator - Generates copyable code from animation configurations
 * 
 * This module transforms the current animation state into production-ready code.
 * It generates both the component definition and usage examples.
 */

import type { AnimationConfig, ComponentDefinition, GeneratedCode } from './types'

/**
 * Generate complete code for a component configuration
 * 
 * @param config - Current animation configuration
 * @param definition - Component definition from registry
 * @returns Generated code with component definition and usage example
 */
export function generateCode(
  config: AnimationConfig,
  definition: ComponentDefinition
): GeneratedCode {
  console.log('[v0] CodeGenerator: Generating code for component:', definition.id)
  console.log('[v0] CodeGenerator: Current props:', config.props)

  const imports = generateImports(definition)
  const componentCode = definition.componentCode || generateComponentCode(definition)
  const usageCode = generateUsageCode(config, definition)
  const cssCode = generateCSSCode(config, definition)

  return {
    componentCode,
    usageCode,
    cssCode,
    imports
  }
}

/**
 * Generate import statements
 */
function generateImports(definition: ComponentDefinition): string[] {
  const imports: string[] = []

  // Main component import
  const mainImportNames = [definition.component.name]
  
  // Add additional imports
  if (definition.additionalImports) {
    const typeImports: string[] = []
    const valueImports: string[] = []
    
    definition.additionalImports.forEach(imp => {
      if (imp.isType) {
        typeImports.push(imp.name)
      } else {
        valueImports.push(imp.name)
      }
    })
    
    if (typeImports.length > 0) {
      imports.push(`import type { ${typeImports.join(', ')} } from '${definition.importPath}'`)
    }
    if (valueImports.length > 0) {
      mainImportNames.push(...valueImports)
    }
  }
  
  imports.unshift(`import { ${mainImportNames.join(', ')} } from '${definition.importPath}'`)
  
  return imports
}

/**
 * Generate the component definition code
 * Uses custom code template if provided, otherwise generates from definition
 */
function generateComponentCode(definition: ComponentDefinition): string {
  // For now, we return the import path as the component is already defined
  // In a full implementation, we could read the actual source file
  return `// Component is defined in: ${definition.importPath}\n// Use the import statement above to use this component`
}

/**
 * Generate usage example with configured props
 */
function generateUsageCode(
  config: AnimationConfig,
  definition: ComponentDefinition
): string {
  const componentName = definition.component.name
  const lines: string[] = []

  lines.push(`// Usage Example`)
  lines.push(`'use client'`)
  lines.push(``)
  
  // Add imports
  lines.push(`import { useState } from 'react'`)
  lines.push(`import { ${componentName} } from '${definition.importPath}'`)
  lines.push(``)
  
  // Add component usage
  lines.push(`export function Example() {`)
  lines.push(`  const [checked, setChecked] = useState(false)`)
  lines.push(``)
  lines.push(`  return (`)
  lines.push(`    <${componentName}`)
  lines.push(`      checked={checked}`)
  lines.push(`      onCheckedChange={setChecked}`)
  
  // Add configured props (skip empty/default values)
  Object.entries(config.props).forEach(([key, value]) => {
    const propConfig = definition.propSchema[key]
    if (!propConfig) return
    
    // Skip if value equals default
    if (value === propConfig.defaultValue) return
    
    // Skip empty strings for optional props
    if (value === '' && propConfig.defaultValue === '') return
    
    // Format value
    let formattedValue: string
    
    if (propConfig.transform) {
      formattedValue = propConfig.transform(value)
      // Skip if transform returns undefined
      if (formattedValue === 'undefined') return
    } else if (typeof value === 'string') {
      formattedValue = `"${value}"`
    } else if (typeof value === 'boolean') {
      formattedValue = value ? 'true' : '{false}'
      // Skip false booleans unless explicitly set
      if (!value) return
    } else {
      formattedValue = `{${value}}`
    }
    
    lines.push(`      ${key}=${formattedValue}`)
  })
  
  lines.push(`    />`)
  lines.push(`  )`)
  lines.push(`}`)
  
  return lines.join('\n')
}

/**
 * Generate CSS-only version (if applicable)
 */
function generateCSSCode(
  config: AnimationConfig,
  definition: ComponentDefinition
): string | undefined {
  // Extract animation-related CSS
  const cssProps: string[] = []
  
  Object.entries(config.props).forEach(([key, value]) => {
    const propConfig = definition.propSchema[key]
    if (!propConfig?.isAnimationProp) return
    
    // Skip default values
    if (value === propConfig.defaultValue) return
    
    // Map prop names to CSS properties
    if (key === 'duration') {
      cssProps.push(`  transition-duration: ${value}ms;`)
    } else if (key === 'timingFunction') {
      cssProps.push(`  transition-timing-function: ${value};`)
    } else if (key === 'delay') {
      if (value > 0) {
        cssProps.push(`  transition-delay: ${value}ms;`)
      }
    }
  })
  
  if (cssProps.length === 0) return undefined
  
  return `.animated-element {\n${cssProps.join('\n')}\n}`
}

/**
 * Copy text to clipboard
 * 
 * @param text - Text to copy
 * @returns Promise that resolves when copy is complete
 */
export async function copyToClipboard(text: string): Promise<void> {
  console.log('[v0] CodeGenerator: Copying to clipboard')
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
  
  console.log('[v0] CodeGenerator: Copy successful')
}
