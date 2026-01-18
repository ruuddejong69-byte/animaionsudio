"use client"

import React from "react"

/**
 * Bezier Curve Editor - Professional curve editor with visual preview
 * 
 * Features:
 * - Interactive control points with drag-and-drop
 * - Visual curve preview with animated ball
 * - Preset easing functions
 * - Real-time CSS cubic-bezier output
 * - Constraint validation (x: 0-1, y: unrestricted)
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { BezierCurve, BezierPoint } from '../core/types'
import { BEZIER_PRESETS } from '../core/types'

interface BezierCurveEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

const CANVAS_SIZE = 300
const POINT_RADIUS = 8

/**
 * Parse cubic-bezier string to BezierCurve object
 */
function parseBezier(value: string): BezierCurve {
  const match = value.match(/cubic-bezier\(([\d.]+),\s*([-\d.]+),\s*([\d.]+),\s*([-\d.]+)\)/)
  if (match) {
    return {
      p1: { x: parseFloat(match[1]), y: parseFloat(match[2]) },
      p2: { x: parseFloat(match[3]), y: parseFloat(match[4]) }
    }
  }
  return BEZIER_PRESETS['ease-in-out']
}

/**
 * Format BezierCurve to CSS cubic-bezier string
 */
function formatBezier(curve: BezierCurve): string {
  return `cubic-bezier(${curve.p1.x.toFixed(2)}, ${curve.p1.y.toFixed(2)}, ${curve.p2.x.toFixed(2)}, ${curve.p2.y.toFixed(2)})`
}

export function BezierCurveEditor({ value, onChange, label = 'Bezier Curve' }: BezierCurveEditorProps) {
  const [curve, setCurve] = useState<BezierCurve>(() => parseBezier(value))
  const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()

  // Update curve when external value changes
  useEffect(() => {
    const parsed = parseBezier(value)
    setCurve(parsed)
  }, [value])

  // Draw curve on canvas
  const drawCurve = useCallback((ctx: CanvasRenderingContext2D, animProgress?: number) => {
    const scale = CANVAS_SIZE - 40
    const offsetX = 20
    const offsetY = 20

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw grid
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const pos = offsetX + (scale / 4) * i
      ctx.beginPath()
      ctx.moveTo(pos, offsetY)
      ctx.lineTo(pos, offsetY + scale)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(offsetX, offsetY + (scale / 4) * i)
      ctx.lineTo(offsetX + scale, offsetY + (scale / 4) * i)
      ctx.stroke()
    }

    // Transform coordinates: canvas uses top-left origin, bezier uses bottom-left
    const toCanvasX = (x: number) => offsetX + x * scale
    const toCanvasY = (y: number) => offsetY + scale - y * scale

    // Start and end points
    const startX = toCanvasX(0)
    const startY = toCanvasY(0)
    const endX = toCanvasX(1)
    const endY = toCanvasY(1)

    // Control points
    const cp1X = toCanvasX(curve.p1.x)
    const cp1Y = toCanvasY(curve.p1.y)
    const cp2X = toCanvasX(curve.p2.x)
    const cp2Y = toCanvasY(curve.p2.y)

    // Draw control lines
    ctx.strokeStyle = '#6b7280'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(cp1X, cp1Y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(endX, endY)
    ctx.lineTo(cp2X, cp2Y)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw bezier curve
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY)
    ctx.stroke()

    // Draw control points
    ctx.fillStyle = '#3b82f6'
    ctx.beginPath()
    ctx.arc(cp1X, cp1Y, POINT_RADIUS, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cp2X, cp2Y, POINT_RADIUS, 0, Math.PI * 2)
    ctx.fill()

    // Draw start/end points
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.arc(startX, startY, POINT_RADIUS / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(endX, endY, POINT_RADIUS / 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw animated ball if animating
    if (animProgress !== undefined) {
      // Calculate point on bezier curve at t=animProgress
      const t = animProgress
      const mt = 1 - t
      const x = mt * mt * mt * startX + 
                3 * mt * mt * t * cp1X + 
                3 * mt * t * t * cp2X + 
                t * t * t * endX
      const y = mt * mt * mt * startY + 
                3 * mt * mt * t * cp1Y + 
                3 * mt * t * t * cp2Y + 
                t * t * t * endY

      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(x, y, POINT_RADIUS, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [curve])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let startTime: number | null = null
    const duration = 2000 // 2 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = (elapsed % duration) / duration

      drawCurve(ctx, isAnimating ? progress : undefined)

      if (isAnimating) {
        requestRef.current = requestAnimationFrame(animate)
      }
    }

    if (isAnimating) {
      requestRef.current = requestAnimationFrame(animate)
    } else {
      drawCurve(ctx)
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [curve, isAnimating, drawCurve])

  // Handle mouse down on canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const scale = CANVAS_SIZE - 40
    const offsetX = 20
    const offsetY = 20

    const toCanvasX = (px: number) => offsetX + px * scale
    const toCanvasY = (py: number) => offsetY + scale - py * scale

    const cp1X = toCanvasX(curve.p1.x)
    const cp1Y = toCanvasY(curve.p1.y)
    const cp2X = toCanvasX(curve.p2.x)
    const cp2Y = toCanvasY(curve.p2.y)

    const dist1 = Math.hypot(x - cp1X, y - cp1Y)
    const dist2 = Math.hypot(x - cp2X, y - cp2Y)

    if (dist1 < POINT_RADIUS * 2) {
      setDragging('p1')
    } else if (dist2 < POINT_RADIUS * 2) {
      setDragging('p2')
    }
  }

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const scale = CANVAS_SIZE - 40
    const offsetX = 20
    const offsetY = 20

    // Convert canvas coordinates to bezier coordinates
    let bx = (x - offsetX) / scale
    let by = 1 - (y - offsetY) / scale

    // Constrain x to 0-1, y is unrestricted but we'll limit for usability
    bx = Math.max(0, Math.min(1, bx))
    by = Math.max(-2, Math.min(2, by))

    const newCurve = { ...curve }
    if (dragging === 'p1') {
      newCurve.p1 = { x: bx, y: by }
    } else {
      newCurve.p2 = { x: bx, y: by }
    }

    setCurve(newCurve)
    onChange(formatBezier(newCurve))
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setDragging(null)
  }

  // Apply preset
  const applyPreset = (presetName: string) => {
    const preset = BEZIER_PRESETS[presetName]
    if (preset) {
      setCurve(preset)
      onChange(formatBezier(preset))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          size="sm"
          variant={isAnimating ? 'default' : 'outline'}
          onClick={() => setIsAnimating(!isAnimating)}
        >
          {isAnimating ? 'Stop' : 'Preview'}
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border rounded-lg cursor-crosshair bg-gray-900"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div className="grid grid-cols-4 gap-2">
        {Object.keys(BEZIER_PRESETS).map((presetName) => (
          <Button
            key={presetName}
            size="sm"
            variant="outline"
            onClick={() => applyPreset(presetName)}
            className="text-xs"
          >
            {presetName}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          className="font-mono text-xs"
        />
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <div>P1: ({curve.p1.x.toFixed(2)}, {curve.p1.y.toFixed(2)})</div>
          </div>
          <div>
            <div>P2: ({curve.p2.x.toFixed(2)}, {curve.p2.y.toFixed(2)})</div>
          </div>
        </div>
      </div>
    </div>
  )
}
