"use client"

/**
 * AnimationStudio - Universal animation component editor
 * 
 * A professional tool for designing, configuring, and exporting animated components.
 * 
 * Features:
 * - Component switcher to work with any registered component
 * - Split mode for A/B comparison of configurations
 * - Real-time preview with interactive controls
 * - Advanced bezier curve editor with visual preview
 * - Comprehensive prop inspector
 * - Code drawer with copyable usage examples
 */

import { useCallback, useEffect, useState } from 'react'
import { Check, Code, Copy, Columns2, Play, RotateCcw, Square, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { PropInspector } from './editors/PropInspector'
import { getAllComponents, getComponent } from './registry/ComponentRegistry'
import { initializeComponents } from './registry/definitions'
import { generateCode, copyToClipboard } from './core/code-generator'
import type { AnimationConfig, ComponentDefinition } from './core/types'

/**
 * Configuration state for a single preview panel
 */
interface PanelConfig {
  props: Record<string, any>
  isActive: boolean
}

/**
 * Custom hook for managing component state
 */
function useComponentState(definition: ComponentDefinition | undefined) {
  const [config, setConfig] = useState<PanelConfig>({
    props: definition?.defaultProps || {},
    isActive: false
  })

  // Reset props when definition changes
  useEffect(() => {
    if (definition) {
      setConfig({
        props: { ...definition.defaultProps },
        isActive: false
      })
    }
  }, [definition])

  const updateProp = useCallback((key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      props: { ...prev.props, [key]: value }
    }))
  }, [])

  const toggleActive = useCallback(() => {
    setConfig(prev => ({ ...prev, isActive: !prev.isActive }))
  }, [])

  const setActive = useCallback((active: boolean) => {
    setConfig(prev => ({ ...prev, isActive: active }))
  }, [])

  const reset = useCallback(() => {
    if (definition) {
      setConfig({
        props: { ...definition.defaultProps },
        isActive: false
      })
    }
  }, [definition])

  return { config, updateProp, toggleActive, setActive, reset, setConfig }
}

/**
 * Component Preview Panel
 * Renders the component with current configuration
 */
function PreviewPanel({
  definition,
  config,
  onToggle,
  isPlaying,
  label
}: {
  definition: ComponentDefinition
  config: PanelConfig
  onToggle: () => void
  isPlaying: boolean
  label?: string
}) {
  const Component = definition.component
  const stateMode = definition.stateMode || 'toggle'

  // Build props based on state mode
  const componentProps = { ...config.props }
  
  if (stateMode === 'toggle') {
    componentProps.checked = config.isActive
    componentProps.onCheckedChange = onToggle
  } else if (stateMode === 'button') {
    // For button, we cycle through states: normal -> loading -> success -> normal
    componentProps.onClick = onToggle
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[250px] bg-gray-900 rounded-lg border border-gray-800">
      {label && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}
      <Component {...componentProps} />
    </div>
  )
}

/**
 * Code Drawer Content
 * Shows the generated code with copy functionality
 */
function CodeDrawerContent({
  definition,
  config
}: {
  definition: ComponentDefinition
  config: PanelConfig
}) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const animationConfig: AnimationConfig = {
    componentId: definition.id,
    props: config.props,
    isActive: config.isActive
  }

  const generatedCode = generateCode(animationConfig, definition)

  const handleCopy = async (code: string, type: string) => {
    await copyToClipboard(code)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="space-y-6 py-4">
      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Component Usage</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(generatedCode.usageCode, 'usage')}
            >
              {copiedCode === 'usage' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed">
            <code>{generatedCode.usageCode}</code>
          </pre>
          <p className="text-xs text-muted-foreground">
            Paste this into your code to use the component with your configured props.
          </p>
        </TabsContent>

        <TabsContent value="import" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Import Statement</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(generatedCode.imports.join('\n'), 'import')}
            >
              {copiedCode === 'import' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed">
            <code>{generatedCode.imports.join('\n')}</code>
          </pre>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-400">
              <strong>Component Location:</strong>
            </p>
            <code className="text-xs text-blue-300 mt-1 block">{definition.importPath}</code>
          </div>
        </TabsContent>

        <TabsContent value="css" className="space-y-4 mt-4">
          {generatedCode.cssCode ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">CSS Animation</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(generatedCode.cssCode!, 'css')}
                >
                  {copiedCode === 'css' ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed">
                <code>{generatedCode.cssCode}</code>
              </pre>
            </>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">Using default animation properties.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Main Animation Studio Component
 */
export function AnimationStudio() {
  // Initialize components on mount
  useEffect(() => {
    initializeComponents()
  }, [])

  const components = getAllComponents()
  const [selectedComponentId, setSelectedComponentId] = useState<string>(
    components[0]?.id || ''
  )
  const [splitMode, setSplitMode] = useState(false)
  const [activePanel, setActivePanel] = useState<'A' | 'B'>('A')
  const [isPlaying, setIsPlaying] = useState(false)

  const currentDefinition = getComponent(selectedComponentId)

  // Panel A state (primary)
  const panelA = useComponentState(currentDefinition)
  // Panel B state (comparison)
  const panelB = useComponentState(currentDefinition)

  // Get current active panel state
  const currentPanel = activePanel === 'A' ? panelA : panelB

  // Auto-play animation loop
  useEffect(() => {
    if (isPlaying && currentDefinition) {
      const stateMode = currentDefinition.stateMode || 'toggle'
      
      if (stateMode === 'toggle') {
        const interval = setInterval(() => {
          panelA.toggleActive()
          if (splitMode) panelB.toggleActive()
        }, 2000)
        return () => clearInterval(interval)
      } else if (stateMode === 'button') {
        // For buttons, cycle: normal -> loading -> success -> normal
        let step = 0
        const interval = setInterval(() => {
          step = (step + 1) % 3
          if (step === 0) {
            panelA.setConfig(prev => ({ ...prev, props: { ...prev.props, loading: false, success: false } }))
            if (splitMode) panelB.setConfig(prev => ({ ...prev, props: { ...prev.props, loading: false, success: false } }))
          } else if (step === 1) {
            panelA.setConfig(prev => ({ ...prev, props: { ...prev.props, loading: true, success: false } }))
            if (splitMode) panelB.setConfig(prev => ({ ...prev, props: { ...prev.props, loading: true, success: false } }))
          } else {
            panelA.setConfig(prev => ({ ...prev, props: { ...prev.props, loading: false, success: true } }))
            if (splitMode) panelB.setConfig(prev => ({ ...prev, props: { ...prev.props, loading: false, success: true } }))
          }
        }, 1500)
        return () => clearInterval(interval)
      }
    }
  }, [isPlaying, currentDefinition, splitMode, panelA, panelB])

  // Handle button state cycling for manual toggle
  const handleToggle = useCallback((panel: 'A' | 'B') => {
    const panelState = panel === 'A' ? panelA : panelB
    const stateMode = currentDefinition?.stateMode || 'toggle'

    if (stateMode === 'toggle') {
      panelState.toggleActive()
    } else if (stateMode === 'button') {
      // Cycle: normal -> loading -> success -> normal
      const { loading, success } = panelState.config.props
      if (!loading && !success) {
        panelState.updateProp('loading', true)
      } else if (loading) {
        panelState.updateProp('loading', false)
        panelState.updateProp('success', true)
      } else {
        panelState.updateProp('success', false)
      }
    }
  }, [currentDefinition, panelA, panelB])

  if (!currentDefinition) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <p>No components registered. Please check the console for errors.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-balance">Animation Studio</h1>
            <p className="text-sm text-muted-foreground text-pretty">
              Design, compare, and export animated components
            </p>
          </div>
          
          {/* Top-right actions */}
          <div className="flex items-center gap-2">
            <Button
              variant={splitMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSplitMode(!splitMode)
                if (!splitMode) {
                  // Copy panel A config to panel B when entering split mode
                  panelB.setConfig({ ...panelA.config })
                }
              }}
            >
              <Columns2 className="w-4 h-4 mr-2" />
              {splitMode ? 'Exit Split' : 'Split Mode'}
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Code className="w-4 h-4 mr-2" />
                  Get Code
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[500px] sm:max-w-[500px] bg-gray-900 border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-white">
                    {splitMode ? `Panel ${activePanel} Code` : 'Generated Code'}
                  </SheetTitle>
                </SheetHeader>
                <CodeDrawerContent
                  definition={currentDefinition}
                  config={currentPanel.config}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left Column: Previews */}
          <div className="space-y-6">
            {/* Component Selector & Controls */}
            <Card className="p-4 bg-gray-900 border-gray-800">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Select value={selectedComponentId} onValueChange={setSelectedComponentId}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {components.map((comp) => (
                        <SelectItem key={comp.id} value={comp.id}>
                          {comp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggle(activePanel)}
                  >
                    Toggle
                  </Button>
                  <Button
                    variant={isPlaying ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      panelA.reset()
                      if (splitMode) panelB.reset()
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {currentDefinition.description}
              </p>
            </Card>

            {/* Preview Area */}
            {splitMode ? (
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`cursor-pointer rounded-lg ${activePanel === 'A' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setActivePanel('A')}
                >
                  <PreviewPanel
                    definition={currentDefinition}
                    config={panelA.config}
                    onToggle={() => handleToggle('A')}
                    isPlaying={isPlaying}
                    label="Panel A"
                  />
                </div>
                <div
                  className={`cursor-pointer rounded-lg ${activePanel === 'B' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setActivePanel('B')}
                >
                  <PreviewPanel
                    definition={currentDefinition}
                    config={panelB.config}
                    onToggle={() => handleToggle('B')}
                    isPlaying={isPlaying}
                    label="Panel B"
                  />
                </div>
              </div>
            ) : (
              <PreviewPanel
                definition={currentDefinition}
                config={panelA.config}
                onToggle={() => handleToggle('A')}
                isPlaying={isPlaying}
              />
            )}

            {/* Split mode panel selector hint */}
            {splitMode && (
              <p className="text-xs text-center text-muted-foreground">
                Click a panel to select it for editing. Currently editing: <strong>Panel {activePanel}</strong>
              </p>
            )}
          </div>

          {/* Right Column: Props Inspector */}
          <div className="space-y-4">
            <Card className="p-5 bg-gray-900 border-gray-800 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              {splitMode && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-800">
                  <Button
                    variant={activePanel === 'A' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setActivePanel('A')}
                  >
                    Panel A
                  </Button>
                  <Button
                    variant={activePanel === 'B' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setActivePanel('B')}
                  >
                    Panel B
                  </Button>
                </div>
              )}
              
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
                Properties {splitMode && `(${activePanel})`}
              </h3>
              
              <PropInspector
                schema={currentDefinition.propSchema}
                values={currentPanel.config.props}
                onChange={currentPanel.updateProp}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
