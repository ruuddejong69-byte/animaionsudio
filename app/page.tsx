"use client"

import { useState } from 'react'
import { Toggle, GooeyFilter } from '@/components/ui/liquid-toggle'

function ToggleDemo({ 
  variant, 
  title,
  description 
}: { 
  variant: 'default' | 'success' | 'warning' | 'danger'
  title: string
  description: string
}) {
  const [checked, setChecked] = useState(false)
  
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center transition-colors hover:border-muted-foreground/20">
      <div className="relative">
        <Toggle 
          variant={variant}
          checked={checked}
          onCheckedChange={setChecked}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs font-mono text-muted-foreground/70">
          Status: {checked ? 'On' : 'Off'}
        </p>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <GooeyFilter />
      
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-8 px-4 py-16 md:py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          <span>New Component</span>
        </div>
        
        <div className="max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
            Liquid Toggle Animation
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Experience buttery smooth toggle animations with mesmerizing gooey transitions. 
            Built with React and Tailwind CSS for modern web experiences.
          </p>
        </div>

        {/* Demo Toggles Grid */}
        <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          <ToggleDemo
            variant="default"
            title="Default"
            description="Classic blue variant for primary actions"
          />
          <ToggleDemo
            variant="success"
            title="Success"
            description="Green variant for positive confirmations"
          />
          <ToggleDemo
            variant="warning"
            title="Warning"
            description="Amber variant for cautionary states"
          />
          <ToggleDemo
            variant="danger"
            title="Danger"
            description="Red variant for critical toggles"
          />
        </div>

        {/* Features Section */}
        <div className="mt-24 grid w-full max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Buttery Smooth</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              GPU-accelerated animations with gooey SVG filters for silky smooth transitions at 60fps.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Fully Customizable</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Four color variants out of the box with easy theming through CSS custom properties.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Production Ready</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              TypeScript support, accessibility focused, and optimized for modern browsers.
            </p>
          </div>
        </div>

        {/* Code Example Section */}
        <div className="mt-24 w-full max-w-4xl rounded-2xl border border-border bg-card p-8">
          <h2 className="text-2xl font-bold text-foreground">Quick Start</h2>
          <p className="mt-2 text-muted-foreground">Add the liquid toggle to your project in seconds</p>
          
          <div className="mt-6 rounded-xl bg-background p-6">
            <pre className="overflow-x-auto text-sm">
              <code className="font-mono text-foreground">
{`import { Toggle, GooeyFilter } from '@/components/ui/liquid-toggle'

export function MyComponent() {
  const [enabled, setEnabled] = useState(false)
  
  return (
    <>
      <GooeyFilter />
      <Toggle 
        variant="default"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
    </>
  )
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, React, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}
