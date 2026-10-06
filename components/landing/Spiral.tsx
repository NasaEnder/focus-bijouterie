'use client'

import { useEffect, useRef } from 'react'

// Spirale logarithmique r = R_OUTER · e^(-B·θ) dessinée dans un canvas.
// La taille des lettres est proportionnelle au rayon, donc l'écart angulaire
// entre deux lettres est constant. La spirale est auto-similaire : décaler la
// phase d'un cycle « FOCUS / » ramène chaque lettre sur la suivante, ce qui
// permet de boucler sans saut en prenant la phase modulo un cycle.

const WORD = ['F', 'O', 'C', 'U', 'S', '/']
// Chasse approximative de chaque glyphe en em (Anton, capitales condensées + interlettrage).
const ADVANCE: Record<string, number> = { F: 0.5, O: 0.6, C: 0.57, U: 0.6, S: 0.56, '/': 0.62 }

const B = 0.05 // pas de la spirale : plus il est petit, plus on voit de tours
const FONT_RATIO = 0.26 // taille de police / rayon (doit tenir dans l'écart entre deux tours)
const R_OUTER = 1100 // en unités (1 unité = 0,1 vmax), au-delà des coins de l'écran
const R_INNER = 2
const OUTER_CYCLES = 5 // cycles en plus à l'extérieur, pour que rien n'apparaisse au bord pendant le tunnel

const STRETCH = Math.sqrt(1 + B * B)
const CYCLE_ANGLE = WORD.reduce((sum, ch) => sum + ADVANCE[ch], 0) * (FONT_RATIO / STRETCH)
// Angle entre le rayon et la tangente (sens de lecture horaire, haut des lettres vers l'extérieur).
const TANGENT_OFFSET = Math.atan2(1, -B)

const IDLE_CYCLE_SECONDS = 2.4
// Tailles de police pré-rendues pour chaque caractère (voir buildSprites).
const SPRITE_FONT_PX = [16, 32, 64, 128, 256, 512]
const SPRITE_PADDING = 2
const LETTER_COLOR = '#f4f2ea'
const MAX_DPR = 2

// Tunnel : la phase recule (les lettres sortent du centre) et les lettres grossissent sur place.
const TUNNEL_ZOOM = 9
const TUNNEL_TRAVEL = Math.log(TUNNEL_ZOOM) / B
const TUNNEL_TURN = 26 // rotation nette pendant le tunnel, en radians (sens horaire)
const TUNNEL_GROWTH = 2 // taille finale = 1 + TUNNEL_GROWTH

// Fondu vers le centre, en fraction de vmin.
const FADE_START = 0.06
const FADE_END = 0.35

type Glyph = { char: string; theta: number }
type Sprite = {
  image: HTMLCanvasElement
  fontPx: number
  // Position du point d'ancrage (centre de la lettre) dans l'image.
  offsetX: number
  offsetY: number
  // Distance max entre l'ancrage et un coin de l'image, en fraction de la taille de police.
  reach: number
}

const GLYPHS: Glyph[] = (() => {
  const glyphs: Glyph[] = []
  let theta = -OUTER_CYCLES * CYCLE_ANGLE
  for (let i = 0; ; i++) {
    const char = WORD[i % WORD.length]
    const step = ADVANCE[char] * (FONT_RATIO / STRETCH)
    const center = theta + step / 2
    if (R_OUTER * Math.exp(-B * center) < R_INNER) break
    glyphs.push({ char, theta: center })
    theta += step
  }
  return glyphs
})()

type Props = {
  // Horodatage (performance.now) du clic sur « Entrer », null tant qu'on n'est pas entré.
  tunnelStart: React.RefObject<number | null>
  tunnelMs: number
}

export default function Spiral({ tunnelStart, tunnelMs }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--font-anton')

    let width = 0
    let height = 0
    let dpr = 1
    // Lettres pré-rendues, disponibles une fois la police chargée.
    let sprites: Map<string, Sprite[]> | null = null

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
    }

    function draw(phase: number, growth: number, spin: number) {
      const unit = (Math.max(width, height) / 1000) * dpr
      const vmin = Math.min(width, height) * dpr
      const fadeStart = FADE_START * vmin
      const fadeSpan = (FADE_END - FADE_START) * vmin
      const cx = (width * dpr) / 2
      const cy = (height * dpr) / 2

      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      if (!sprites) return
      // Les niveaux pré-rendus suffisent : un lissage bilinéaire simple est le moins coûteux.
      ctx!.imageSmoothingQuality = 'low'

      for (const glyph of GLYPHS) {
        const c = glyph.theta + phase
        const r = R_OUTER * Math.exp(-B * c) * unit
        const size = r * FONT_RATIO * growth
        if (size < 1) continue
        const alpha = Math.min(1, (r - fadeStart) / fadeSpan)
        if (alpha <= 0) continue

        const sprite = pickSprite(sprites.get(glyph.char)!, size)
        const position = c + spin
        const x = cx + r * Math.cos(position)
        const y = cy + r * Math.sin(position)
        const reach = sprite.reach * size
        if (x + reach < 0 || x - reach > 2 * cx || y + reach < 0 || y - reach > 2 * cy) continue

        const angle = position + TANGENT_OFFSET
        const k = size / sprite.fontPx
        const cos = Math.cos(angle) * k
        const sin = Math.sin(angle) * k
        ctx!.globalAlpha = alpha
        ctx!.setTransform(cos, sin, -sin, cos, x, y)
        ctx!.drawImage(sprite.image, sprite.offsetX, sprite.offsetY)
      }
      ctx!.globalAlpha = 1
    }

    resize()

    let disposed = false
    const font = `400 ${SPRITE_FONT_PX[SPRITE_FONT_PX.length - 1]}px ${fontFamily}`
    const fontReady = document.fonts
      .load(font)
      .catch(() => undefined)
      .then(() => {
        if (!disposed) sprites = buildSprites(fontFamily)
      })

    if (reducedMotion) {
      const drawStatic = () => draw(0, 1, 0)
      const onResize = () => {
        resize()
        drawStatic()
      }
      fontReady.then(drawStatic)
      window.addEventListener('resize', onResize)
      return () => {
        disposed = true
        window.removeEventListener('resize', onResize)
      }
    }

    const idleSpeed = CYCLE_ANGLE / IDLE_CYCLE_SECONDS
    let frame = 0
    let last = performance.now()
    let idlePhase = 0

    function tick(now: number) {
      // Plafonne le pas de temps : pas de bond si l'onglet revient au premier plan.
      const dt = Math.min(now - last, 100) / 1000
      last = now
      idlePhase = (idlePhase + idleSpeed * dt) % CYCLE_ANGLE

      let phase = idlePhase
      let growth = 1
      let spin = 0
      const start = tunnelStart.current
      if (start !== null) {
        const t = Math.min(1, (now - start) / tunnelMs)
        const eased = t * t * t
        const travel = TUNNEL_TRAVEL * eased
        phase -= travel
        // Reculer la phase fait aussi tourner la spirale en sens antihoraire : on compense ce
        // recul puis on ajoute TUNNEL_TURN, pour tourner en sens horaire sans changer le zoom.
        spin = travel + TUNNEL_TURN * eased
        growth += TUNNEL_GROWTH * t * t
      }

      draw(mod(phase, CYCLE_ANGLE), growth, spin)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [tunnelStart, tunnelMs])

  return <canvas ref={canvasRef} aria-hidden className="fade-in-slow absolute inset-0 size-full" />
}

// Chaque caractère est rendu une seule fois à plusieurs tailles, recadré au plus près de
// l'encre : poser une petite image transformée coûte bien moins cher que redessiner le
// contour vectoriel d'une lettre à chaque frame.
function buildSprites(fontFamily: string): Map<string, Sprite[]> {
  const sprites = new Map<string, Sprite[]>()
  for (const char of new Set(WORD)) {
    sprites.set(
      char,
      SPRITE_FONT_PX.map((fontPx) => {
        const image = document.createElement('canvas')
        const ctx = image.getContext('2d')!
        const font = `400 ${fontPx}px ${fontFamily}`
        ctx.font = font
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const box = ctx.measureText(char)
        const left = Math.ceil(box.actualBoundingBoxLeft) + SPRITE_PADDING
        const top = Math.ceil(box.actualBoundingBoxAscent) + SPRITE_PADDING
        image.width = left + Math.ceil(box.actualBoundingBoxRight) + SPRITE_PADDING
        image.height = top + Math.ceil(box.actualBoundingBoxDescent) + SPRITE_PADDING

        // Redimensionner le canvas réinitialise son contexte.
        ctx.font = font
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = LETTER_COLOR
        ctx.fillText(char, left, top)

        const reach = Math.hypot(Math.max(left, image.width - left), Math.max(top, image.height - top))
        return { image, fontPx, offsetX: -left, offsetY: -top, reach: reach / fontPx }
      }),
    )
  }
  return sprites
}

// Plus petite version au moins aussi grande que la lettre à l'écran (sinon la plus grande).
function pickSprite(levels: Sprite[], size: number): Sprite {
  return levels.find((sprite) => sprite.fontPx >= size) ?? levels[levels.length - 1]
}

function mod(value: number, modulo: number): number {
  return ((value % modulo) + modulo) % modulo
}
