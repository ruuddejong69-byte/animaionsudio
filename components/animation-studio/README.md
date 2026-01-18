# Animation Studio

A professional, modular system for designing, configuring, and exporting animated React components with real-time preview and code generation.

## Architecture

### 📁 Project Structure

```
/components
  /liquid-components           # Vendor components (reusable animated components)
    /LiquidToggle
      LiquidToggle.tsx         # Component implementation
      index.ts                 # Barrel export
    /LiquidCheckbox
      LiquidCheckbox.tsx
      index.ts
      
  /animation-studio            # Studio module (universal editor)
    /core                      # Core engine
      types.ts                 # Type definitions
      code-generator.ts        # Code generation utilities
    /editors                   # Editor components
      BezierCurveEditor.tsx    # Visual bezier curve editor
      ColorPicker.tsx          # Color picker with presets
      PropInspector.tsx        # Universal prop editor
    /registry                  # Component registry
      ComponentRegistry.ts     # Registry implementation
      /definitions             # Component definitions
        liquid-toggle.ts       # Toggle definition
        liquid-checkbox.ts     # Checkbox definition
        index.ts               # Registration entry point
    AnimationStudio.tsx        # Main studio component
    index.ts                   # Public API exports
    
/scripts
  generate-component.mjs       # CLI tool for scaffolding new components
```

## Key Concepts

### 1. Separation of Concerns

- **Liquid Components**: Pure, reusable React components with animation props
- **Animation Studio**: Universal editor that works with any registered component
- **Component Registry**: Plugin-based system for adding new components

### 2. Component Definition

Each animatable component needs a definition that tells the studio how to work with it:

```typescript
import { LiquidToggle } from '@/components/liquid-components/LiquidToggle'
import type { ComponentDefinition } from '../../core/types'

export const liquidToggleDefinition: ComponentDefinition = {
  id: 'liquid-toggle',
  name: 'Liquid Toggle',
  description: 'A toggle switch with smooth liquid morphing animations',
  component: LiquidToggle,
  category: 'forms',
  tags: ['toggle', 'switch', 'liquid'],
  importPath: '@/components/liquid-components/LiquidToggle',
  
  propSchema: {
    duration: {
      label: 'Duration',
      type: 'range',
      defaultValue: 600,
      min: 100,
      max: 2000,
      step: 50,
      isAnimationProp: true
    },
    // ... more props
  },
  
  defaultProps: {
    duration: 600,
    // ... more defaults
  }
}
```

### 3. Prop Schema

The `propSchema` defines how each prop should be edited in the studio:

- **`type`**: Editor type (`number`, `string`, `boolean`, `color`, `bezier`, `select`, `range`)
- **`label`**: Display name in UI
- **`defaultValue`**: Initial value
- **`isAnimationProp`**: Marks props that affect animation timing
- **`transform`**: Function to transform value for code generation
- **`options`**: Available options for select type
- **`min`/`max`/`step`**: Constraints for number/range types

## Adding New Components

### Method 1: CLI Generator (Recommended)

```bash
node scripts/generate-component.mjs MyButton
```

This creates:
- Component file: `/components/liquid-components/MyButton/MyButton.tsx`
- Index file: `/components/liquid-components/MyButton/index.ts`
- Definition file: `/components/animation-studio/registry/definitions/my-button.ts`

Then:
1. Customize the component implementation
2. Update the prop schema in the definition
3. Register it in `/components/animation-studio/registry/definitions/index.ts`:

```typescript
import { myButtonDefinition } from './my-button'
registerComponent(myButtonDefinition)
```

### Method 2: Manual

1. **Create the component** in `/components/liquid-components/YourComponent/`
2. **Create the definition** in `/components/animation-studio/registry/definitions/your-component.ts`
3. **Register it** in `/components/animation-studio/registry/definitions/index.ts`

## Features

### 🎨 Visual Bezier Curve Editor

- Interactive drag-and-drop control points
- Real-time curve preview with animated ball
- Preset easing functions (ease, ease-in, ease-out, etc.)
- Constraint validation (x: 0-1, y: unrestricted)

### 🎛️ Universal Prop Inspector

Automatically generates the appropriate editor for each prop type:
- **Range**: Slider with numeric input
- **Color**: Color picker with preset swatches
- **Bezier**: Visual curve editor
- **Select**: Dropdown with options
- **Boolean**: Toggle switch
- **String/Number**: Text input

### 📋 Code Generation

Generates three types of code:
1. **Usage Example**: Shows how to use the component with configured props
2. **Component Source**: Import statements and location
3. **CSS Only**: Animation properties extracted as CSS

### 🔄 Real-time Preview

- Interactive preview with state toggling
- Loop mode for continuous animation
- Responsive to all prop changes

## Usage

### In Your App

```tsx
import { AnimationStudio } from '@/components/animation-studio'

export default function Page() {
  return <AnimationStudio />
}
```

### Using Generated Components

After configuring a component in the studio and copying the usage code:

```tsx
'use client'

import { useState } from 'react'
import { LiquidToggle } from '@/components/liquid-components/LiquidToggle'

export function Example() {
  const [checked, setChecked] = useState(false)

  return (
    <LiquidToggle
      checked={checked}
      onCheckedChange={setChecked}
      variant="success"
      duration={800}
      timingFunction="cubic-bezier(0.68, -0.6, 0.32, 1.6)"
    />
  )
}
```

## Extending the System

### Custom Prop Types

To add a new prop type editor:

1. Add the type to `PropType` in `/components/animation-studio/core/types.ts`
2. Create the editor component in `/components/animation-studio/editors/`
3. Add a case in `PropInspector.tsx` to render your editor

### Custom Code Templates

Override the default code generation by providing a `componentCode` property in your component definition:

```typescript
export const myDefinition: ComponentDefinition = {
  // ... other props
  componentCode: `
    // Your custom component template here
    // This will be used instead of the default
  `
}
```

## Best Practices

1. **Keep components pure**: Vendor components should only handle props and rendering
2. **Document everything**: Use JSDoc comments for all public APIs
3. **Use console.log with [v0] prefix**: Makes debugging easier
4. **Validate props**: Use the `validate` function in prop config for custom validation
5. **Test thoroughly**: Ensure components work with all prop combinations

## Troubleshooting

### Component not showing up

- Check that you've called `initializeComponents()` (it's automatic in AnimationStudio)
- Verify the component is registered in `/components/animation-studio/registry/definitions/index.ts`
- Check browser console for registration errors

### Bezier curve not working

- Ensure x values are between 0-1
- y values can be outside 0-1 for bounce effects
- Check that `timingFunction` prop is passed to the CSS transition

### Code generation issues

- Verify `transform` functions in prop schema return valid strings
- Check that `importPath` is correct
- Ensure all required props have default values

## Contributing

When adding new components:
1. Follow the established patterns
2. Add comprehensive JSDoc comments
3. Include usage examples
4. Test in the studio before committing
5. Update this README if you add new features
