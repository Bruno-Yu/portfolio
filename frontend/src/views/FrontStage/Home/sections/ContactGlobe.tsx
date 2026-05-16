import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import createGlobe, { type Globe, type COBEOptions } from 'cobe'
import type { RootState } from '@/store/index'

const TAINAN: [number, number] = [22.9999, 120.2269]

function getMotionPreference() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function colorsFor(theme: 'light' | 'dark'): Pick<
  COBEOptions,
  'baseColor' | 'markerColor' | 'glowColor' | 'dark' | 'mapBrightness'
> {
  if (theme === 'dark') {
    return {
      baseColor: [0.20, 0.18, 0.14],
      markerColor: [1, 0.82, 0.18],
      glowColor: [0.25, 0.22, 0.17],
      dark: 1,
      mapBrightness: 5.0,
    }
  }

  return {
    baseColor: [0.48, 0.43, 0.36],
    markerColor: [0.96, 0.77, 0.1],
    glowColor: [0.96, 0.94, 0.88],
    dark: 0,
    mapBrightness: 9.5,
  }
}

export default function ContactGlobe() {
  const theme = useSelector((state: RootState) => state.ui.theme)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const globeRef = useRef<Globe | null>(null)
  const frameRef = useRef<number>()
  const [hasCanvas, setHasCanvas] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let phi = 2.09
    let width = 0
    let height = 0
    let reduceMotion = getMotionPreference()

    const resize = () => {
      const size = Math.max(220, Math.floor(canvas.clientWidth))
      width = size
      height = size
      globeRef.current?.update({ width, height })
    }

    try {
      resize()
      const globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height,
        phi,
        theta: 0.28,
        diffuse: 2.2,
        scale: 1,
        mapSamples: 16000,
        mapBaseBrightness: 0.05,
        opacity: 0.97,
        offset: [0, 0],
        markerElevation: 0.03,
        markerColor: colorsFor(theme).markerColor,
        baseColor: colorsFor(theme).baseColor,
        glowColor: colorsFor(theme).glowColor,
        dark: colorsFor(theme).dark,
        mapBrightness: colorsFor(theme).mapBrightness,
        markers: [{ location: TAINAN, size: 0.1 }],
      })
      globeRef.current = globe

      const tick = () => {
        if (!reduceMotion) phi += 0.0022
        globe.update({ phi, ...colorsFor(theme) })
        frameRef.current = window.requestAnimationFrame(tick)
      }
      tick()

      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(canvas)

      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      const onMotionChange = () => { reduceMotion = motionQuery.matches }
      motionQuery.addEventListener('change', onMotionChange)

      return () => {
        resizeObserver.disconnect()
        motionQuery.removeEventListener('change', onMotionChange)
        if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
        globe.destroy()
        globeRef.current = null
      }
    } catch {
      setHasCanvas(false)
    }
  }, [theme])

  return (
    <div className="contact-globe" aria-hidden="true">
      {hasCanvas ? (
        <canvas ref={canvasRef} className="contact-globe__canvas" />
      ) : (
        <div className="contact-globe__fallback">
          <span />
        </div>
      )}
      <div className="contact-globe__meta">
        <span className="contact-globe__meta-coord">22.99°N · 120.22°E</span>
        <span className="contact-globe__meta-loc">Tainan · Taiwan</span>
        <span className="contact-globe__meta-status">
          <span className="status-dot" />
          Open to conversations
        </span>
      </div>
    </div>
  )
}
