import { useEffect, useRef } from 'react'

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern

interface GridOffset {
  x: number
  y: number
}

interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left'
  speed?: number
  borderColor?: CanvasStrokeStyle
  squareSize?: number
  hoverFillColor?: CanvasStrokeStyle
}

export default function SquaresBackground({
  direction = 'right',
  speed = 0.9,
  borderColor = 'rgba(255,255,255,0.06)',
  squareSize = 48,
  hoverFillColor = 'rgba(138,43,226,0.12)',
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const requestRef = useRef<number | null>(null)
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 })
  const hoveredSquareRef = useRef<GridOffset | null>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const c = canvas
    const cctx = ctx

    function resizeCanvas() {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      c.width = Math.floor(c.clientWidth * dpr)
      c.height = Math.floor(c.clientHeight * dpr)
      cctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    let numSquaresX = 0
    let numSquaresY = 0

    function recalcGrid() {
      numSquaresX = Math.ceil(c.width / squareSize) + 2
      numSquaresY = Math.ceil(c.height / squareSize) + 2
    }

    function drawGrid() {
      cctx.clearRect(0, 0, c.width, c.height)

      const offX = gridOffset.current.x % squareSize
      const offY = gridOffset.current.y % squareSize

      // subtle background glow
      const radial = cctx.createRadialGradient(
        c.width / 2,
        c.height / 2,
        0,
        c.width / 2,
        c.height / 2,
        Math.max(c.width, c.height) / 1.8,
      )
      radial.addColorStop(0, 'rgba(0,0,0,0)')
      radial.addColorStop(1, 'rgba(0,0,0,0.36)')
      cctx.fillStyle = radial
      cctx.fillRect(0, 0, c.width, c.height)

      cctx.lineWidth = 1

      for (let xi = -1; xi < numSquaresX; xi++) {
        for (let yi = -1; yi < numSquaresY; yi++) {
          const x = xi * squareSize - offX
          const y = yi * squareSize - offY

          // hover glow for hovered square
          if (hoveredSquareRef.current && hoveredSquareRef.current.x === xi && hoveredSquareRef.current.y === yi) {
            cctx.save()
            cctx.fillStyle = hoverFillColor as string
            cctx.shadowColor = 'rgba(138,43,226,0.55)'
            cctx.shadowBlur = 18
            cctx.fillRect(x + 1, y + 1, squareSize - 2, squareSize - 2)
            cctx.restore()
          }

          cctx.strokeStyle = borderColor as string
          cctx.strokeRect(x + 0.5, y + 0.5, squareSize - 1, squareSize - 1)
        }
      }

      // mouse ripple subtle highlight
      if (mouseRef.current) {
        const { x, y } = mouseRef.current
        const gradient = cctx.createRadialGradient(x, y, 0, x, y, 180)
        gradient.addColorStop(0, 'rgba(138,43,226,0.08)')
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        cctx.fillStyle = gradient
        cctx.fillRect(x - 180, y - 180, 360, 360)
      }
    }

    function updateAnimation() {
      const effectiveSpeed = Math.max(speed, 0.05)
      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          break
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize
          break
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize
          break
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize
          break
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize
          break
        default:
          break
      }

      drawGrid()
      requestRef.current = requestAnimationFrame(updateAnimation)
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = c.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      mouseRef.current = { x: mx, y: my }

      const xi = Math.floor((mx + gridOffset.current.x) / squareSize)
      const yi = Math.floor((my + gridOffset.current.y) / squareSize)
      hoveredSquareRef.current = { x: xi, y: yi }
    }

    function handleMouseLeave() {
      hoveredSquareRef.current = null
      mouseRef.current = null
    }

    function onResize() {
      resizeCanvas()
      recalcGrid()
      drawGrid()
    }

    window.addEventListener('resize', onResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // initial setup
    resizeCanvas()
    recalcGrid()
    drawGrid()
    requestRef.current = requestAnimationFrame(updateAnimation)

    return () => {
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [direction, speed, borderColor, hoverFillColor, squareSize])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  )
}
