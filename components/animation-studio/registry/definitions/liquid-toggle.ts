/**
 * Component definition for LiquidToggle
 * Registers the LiquidToggle component with the animation studio
 */

import { LiquidToggle } from '@/components/liquid-components/LiquidToggle'
import type { ComponentDefinition } from '../../core/types'

export const liquidToggleDefinition: ComponentDefinition = {
  id: 'liquid-toggle',
  name: 'Liquid Toggle',
  description: 'A toggle switch with smooth liquid morphing animations and gooey effects',
  component: LiquidToggle,
  category: 'forms',
  tags: ['toggle', 'switch', 'liquid', 'animated', 'form'],
  importPath: '@/components/liquid-components/LiquidToggle',
  
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
      defaultValue: 600,
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
      transform: (value: string) => `"${value}"`
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
      transform: (value: string) => value ? `"${value}"` : 'undefined'
    },
    secondaryColor: {
      label: 'Secondary Color',
      type: 'color',
      defaultValue: '',
      description: 'Secondary color (overrides variant)',
      transform: (value: string) => value ? `"${value}"` : 'undefined'
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
    duration: 600,
    timingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    delay: 0,
    primaryColor: '',
    secondaryColor: '',
    disabled: false
  },
  
  additionalImports: [
    { name: 'LiquidToggleProps', path: '@/components/liquid-components/LiquidToggle', isType: true }
  ]
}
