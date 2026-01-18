"use client"

/**
 * PropInspector - Universal prop editor that displays all component props
 * 
 * Automatically generates the appropriate editor for each prop type:
 * - number/range: Slider with input
 * - string: Text input
 * - boolean: Checkbox
 * - color: Color picker
 * - bezier: Bezier curve editor
 * - select: Dropdown
 */

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { BezierCurveEditor } from './BezierCurveEditor'
import { ColorPicker } from './ColorPicker'
import type { PropSchema } from '../core/types'

interface PropInspectorProps {
  schema: PropSchema
  values: Record<string, any>
  onChange: (key: string, value: any) => void
}

export function PropInspector({ schema, values, onChange }: PropInspectorProps) {
  return (
    <div className="space-y-6">
      {Object.entries(schema).map(([key, config]) => (
        <div key={key} className="space-y-2">
          {config.type === 'boolean' ? (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={key}>{config.label}</Label>
                {config.description && (
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                )}
              </div>
              <Switch
                id={key}
                checked={values[key] ?? config.defaultValue}
                onCheckedChange={(checked) => onChange(key, checked)}
              />
            </div>
          ) : config.type === 'select' ? (
            <div className="space-y-2">
              <Label htmlFor={key}>
                {config.label}
                {config.isAnimationProp && (
                  <span className="ml-2 text-xs text-blue-400">⏱ Animation</span>
                )}
              </Label>
              {config.description && (
                <p className="text-xs text-muted-foreground">{config.description}</p>
              )}
              <Select
                value={String(values[key] ?? config.defaultValue)}
                onValueChange={(value) => onChange(key, value)}
              >
                <SelectTrigger id={key}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.options?.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : config.type === 'range' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={key}>
                  {config.label}
                  {config.isAnimationProp && (
                    <span className="ml-2 text-xs text-blue-400">⏱ Animation</span>
                  )}
                </Label>
                <Input
                  type="number"
                  value={values[key] ?? config.defaultValue}
                  onChange={(e) => onChange(key, parseFloat(e.target.value) || config.defaultValue)}
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  className="w-20 h-8 text-right"
                />
              </div>
              {config.description && (
                <p className="text-xs text-muted-foreground">{config.description}</p>
              )}
              <Slider
                id={key}
                value={[values[key] ?? config.defaultValue]}
                onValueChange={([value]) => onChange(key, value)}
                min={config.min}
                max={config.max}
                step={config.step}
              />
            </div>
          ) : config.type === 'color' ? (
            <div className="space-y-2">
              <Label>
                {config.label}
              </Label>
              {config.description && (
                <p className="text-xs text-muted-foreground">{config.description}</p>
              )}
              <ColorPicker
                value={values[key] ?? config.defaultValue}
                onChange={(value) => onChange(key, value)}
              />
            </div>
          ) : config.type === 'bezier' ? (
            <div className="space-y-2">
              <BezierCurveEditor
                label={`${config.label}${config.isAnimationProp ? ' ⏱' : ''}`}
                value={values[key] ?? config.defaultValue}
                onChange={(value) => onChange(key, value)}
              />
              {config.description && (
                <p className="text-xs text-muted-foreground">{config.description}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={key}>{config.label}</Label>
              {config.description && (
                <p className="text-xs text-muted-foreground">{config.description}</p>
              )}
              <Input
                id={key}
                type={config.type === 'number' ? 'number' : 'text'}
                value={values[key] ?? config.defaultValue}
                onChange={(e) => {
                  const value = config.type === 'number' 
                    ? parseFloat(e.target.value) || config.defaultValue
                    : e.target.value
                  onChange(key, value)
                }}
                min={config.min}
                max={config.max}
                step={config.step}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
