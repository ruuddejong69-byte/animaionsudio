#!/usr/bin/env node

/**
 * Component Generator CLI
 * 
 * Scaffolds a new animatable component with all the boilerplate needed
 * to integrate with the Animation Studio.
 * 
 * Usage:
 *   node scripts/generate-component.mjs MyButton
 * 
 * This creates:
 *   - /components/liquid-components/MyButton/MyButton.tsx (component file)
 *   - /components/liquid-components/MyButton/index.ts (barrel export)
 *   - /components/animation-studio/registry/definitions/my-button.ts (definition)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get component name from command line
const componentName = process.argv[2];

if (!componentName) {
  console.error('❌ Error: Please provide a component name');
  console.log('Usage: node scripts/generate-component.mjs MyButton');
  process.exit(1);
}

// Generate paths and names
const kebabCase = componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const componentDir = path.join(__dirname, '..', 'components', 'liquid-components', componentName);
const definitionPath = path.join(__dirname, '..', 'components', 'animation-studio', 'registry', 'definitions', `${kebabCase}.ts`);

console.log(`\n🎨 Generating new animatable component: ${componentName}\n`);

// Component template
const componentTemplate = `"use client"

import { useEffect, useId, useState } from 'react'

/**
 * Variant color schemes for the ${componentName}
 */
export type ${componentName}Variant = 'default' | 'success' | 'warning' | 'danger'

/**
 * Props for the ${componentName} component
 */
export interface ${componentName}Props {
  /** Controlled checked/active state */
  checked?: boolean
  /** Callback fired when state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Visual variant for color theming */
  variant?: ${componentName}Variant
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
const variantColors: Record<${componentName}Variant, { primary: string; secondary: string }> = {
  default: { primary: '#3b82f6', secondary: '#e5e7eb' },
  success: { primary: '#10b981', secondary: '#e5e7eb' },
  warning: { primary: '#f59e0b', secondary: '#e5e7eb' },
  danger: { primary: '#ef4444', secondary: '#e5e7eb' }
}

/**
 * ${componentName} - An animatable component with liquid morphing effects
 * 
 * @example
 * \`\`\`tsx
 * <${componentName} 
 *   checked={isActive}
 *   onCheckedChange={setIsActive}
 *   variant="success"
 *   duration={500}
 * />
 * \`\`\`
 */
export function ${componentName}({
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
}: ${componentName}Props) {
  const [internalChecked, setInternalChecked] = useState(false)
  const filterId = useId()
  
  useEffect(() => {
    if (externalChecked !== undefined) {
      console.log('[v0] ${componentName}: Syncing external state:', externalChecked)
      setInternalChecked(externalChecked)
    }
  }, [externalChecked])

  const isChecked = externalChecked !== undefined ? externalChecked : internalChecked

  const handleClick = () => {
    if (disabled) return
    
    const newChecked = !isChecked
    console.log('[v0] ${componentName}: State changed:', newChecked)
    
    if (externalChecked === undefined) {
      setInternalChecked(newChecked)
    }
    onCheckedChange?.(newChecked)
  }

  const colors = variantColors[variant]
  const activePrimary = primaryColor || colors.primary
  const activeSecondary = secondaryColor || colors.secondary

  return (
    <>
      <GooeyFilter id={filterId} />
      <button
        type="button"
        role="button"
        aria-pressed={isChecked}
        aria-label={ariaLabel || '${componentName}'}
        disabled={disabled}
        onClick={handleClick}
        className="relative inline-flex items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: isChecked ? activePrimary : activeSecondary,
          transitionProperty: 'background-color',
          transitionDuration: \`\${duration}ms\`,
          transitionTimingFunction: timingFunction,
          transitionDelay: \`\${delay}ms\`,
          filter: \`url(#\${filterId})\`,
          // TODO: Add your custom styles here
          padding: '1rem 2rem'
        }}
      >
        <span style={{
          transitionProperty: 'all',
          transitionDuration: \`\${duration}ms\`,
          transitionTimingFunction: timingFunction,
          transitionDelay: \`\${delay}ms\`,
          // TODO: Add animated content here
        }}>
          {isChecked ? 'Active' : 'Inactive'}
        </span>
      </button>
    </>
  )
}
`;

// Index template
const indexTemplate = `export { ${componentName}, GooeyFilter } from './${componentName}'
export type { ${componentName}Props, ${componentName}Variant } from './${componentName}'
`;

// Definition template
const definitionTemplate = `/**
 * Component definition for ${componentName}
 * Registers the ${componentName} component with the animation studio
 */

import { ${componentName} } from '@/components/liquid-components/${componentName}'
import type { ComponentDefinition } from '../../core/types'

export const ${kebabCase}Definition: ComponentDefinition = {
  id: '${kebabCase}',
  name: '${componentName}',
  description: 'TODO: Add description for ${componentName}',
  component: ${componentName},
  category: 'custom', // TODO: Change category (forms, feedback, navigation, etc.)
  tags: ['animated', 'liquid', 'custom'],
  importPath: '@/components/liquid-components/${componentName}',
  
  propSchema: {
    variant: {
      label: 'Variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' }
      ],
      description: 'Visual variant for color theming'
    },
    duration: {
      label: 'Duration',
      type: 'range',
      defaultValue: 500,
      min: 100,
      max: 2000,
      step: 50,
      description: 'Animation duration in milliseconds',
      isAnimationProp: true
    },
    timingFunction: {
      label: 'Timing Function',
      type: 'bezier',
      defaultValue: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      description: 'Animation easing curve',
      isAnimationProp: true,
      transform: (value: string) => \`"\${value}"\`
    },
    delay: {
      label: 'Delay',
      type: 'range',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 50,
      description: 'Animation delay in milliseconds',
      isAnimationProp: true
    },
    primaryColor: {
      label: 'Primary Color',
      type: 'color',
      defaultValue: '',
      description: 'Primary color (overrides variant)',
      transform: (value: string) => value ? \`"\${value}"\` : 'undefined'
    },
    secondaryColor: {
      label: 'Secondary Color',
      type: 'color',
      defaultValue: '',
      description: 'Secondary color (overrides variant)',
      transform: (value: string) => value ? \`"\${value}"\` : 'undefined'
    },
    disabled: {
      label: 'Disabled',
      type: 'boolean',
      defaultValue: false,
      description: 'Disabled state'
    }
  },
  
  defaultProps: {
    variant: 'default',
    duration: 500,
    timingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    delay: 0,
    primaryColor: '',
    secondaryColor: '',
    disabled: false
  },
  
  additionalImports: [
    { name: '${componentName}Props', path: '@/components/liquid-components/${componentName}', isType: true }
  ]
}
`;

// Create directories
fs.mkdirSync(componentDir, { recursive: true });

// Write component file
fs.writeFileSync(path.join(componentDir, `${componentName}.tsx`), componentTemplate);
console.log(`✅ Created component: components/liquid-components/${componentName}/${componentName}.tsx`);

// Write index file
fs.writeFileSync(path.join(componentDir, 'index.ts'), indexTemplate);
console.log(`✅ Created index: components/liquid-components/${componentName}/index.ts`);

// Write definition file
fs.writeFileSync(definitionPath, definitionTemplate);
console.log(`✅ Created definition: components/animation-studio/registry/definitions/${kebabCase}.ts`);

console.log(`
✨ Component generated successfully!

📝 Next steps:
   1. Customize the component in: components/liquid-components/${componentName}/${componentName}.tsx
   2. Update the definition in: components/animation-studio/registry/definitions/${kebabCase}.ts
   3. Register it in: components/animation-studio/registry/definitions/index.ts
      
      Add this line:
      import { ${kebabCase}Definition } from './${kebabCase}'
      registerComponent(${kebabCase}Definition)

   4. Restart your dev server to see the new component in the studio!
`);
