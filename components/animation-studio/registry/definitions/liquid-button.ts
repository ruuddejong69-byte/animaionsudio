/**
 * Component definition for LiquidButton
 * Registers the LiquidButton component with the animation studio
 */

import { LiquidButton } from '@/components/liquid-components/LiquidButton'
import type { ComponentDefinition } from '../../core/types'

export const liquidButtonDefinition: ComponentDefinition = {
  id: 'liquid-button',
  name: 'Liquid Button',
  description: 'A button with smooth liquid morphing animations for loading and success states',
  component: LiquidButton,
  category: 'forms',
  tags: ['button', 'liquid', 'animated', 'loading', 'form'],
  importPath: '@/components/liquid-components/LiquidButton',
  
  /**
   * Custom state handler for button - uses loading/success instead of checked
   */
  stateMode: 'button',
  
  propSchema: {
    children: {
      label: 'Button Text',
      type: 'string',
      defaultValue: 'Submit',
      description: 'Text content displayed in the button'
    },
    loading: {
      label: 'Loading State',
      type: 'boolean',
      defaultValue: false,
      description: 'Shows a spinning loader when true'
    },
    success: {
      label: 'Success State',
      type: 'boolean',
      defaultValue: false,
      description: 'Shows a checkmark when true'
    },
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
      defaultValue: 400,
      min: 100,
      max: 1500,
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
      defaultValue: '#3b82f6',
      description: 'Primary background color (overrides variant)'
    },
    secondaryColor: {
      label: 'Secondary Color',
      type: 'color',
      defaultValue: '#2563eb',
      description: 'Hover/active state color (overrides variant)'
    },
    disabled: {
      label: 'Disabled',
      type: 'boolean',
      defaultValue: false,
      description: 'Disable button interactions'
    }
  },
  
  defaultProps: {
    children: 'Submit',
    loading: false,
    success: false,
    variant: 'default',
    duration: 400,
    timingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    delay: 0,
    primaryColor: '#3b82f6',
    secondaryColor: '#2563eb',
    disabled: false
  },
  
  additionalImports: [
    { name: 'LiquidButtonProps', path: '@/components/liquid-components/LiquidButton', isType: true }
  ]
}
