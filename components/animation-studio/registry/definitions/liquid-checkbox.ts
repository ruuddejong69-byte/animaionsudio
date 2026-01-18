/**
 * Component definition for LiquidCheckbox
 * Registers the LiquidCheckbox component with the animation studio
 */

import { LiquidCheckbox } from '@/components/liquid-components/LiquidCheckbox'
import type { ComponentDefinition } from '../../core/types'

export const liquidCheckboxDefinition: ComponentDefinition = {
  id: 'liquid-checkbox',
  name: 'Liquid Checkbox',
  description: 'A checkbox with smooth liquid morphing animations and gooey effects',
  component: LiquidCheckbox,
  category: 'forms',
  tags: ['checkbox', 'liquid', 'animated', 'form'],
  importPath: '@/components/liquid-components/LiquidCheckbox',
  
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
    duration: 500,
    timingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    delay: 0,
    primaryColor: '',
    secondaryColor: '',
    disabled: false
  },
  
  additionalImports: [
    { name: 'LiquidCheckboxProps', path: '@/components/liquid-components/LiquidCheckbox', isType: true }
  ]
}
