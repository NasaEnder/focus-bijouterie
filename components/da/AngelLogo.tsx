// Logo provisoire : ange « bibliquement correct ».
// Six ailes de séraphin (Isaïe 6), roues imbriquées couvertes d'yeux (ophanim, Ézéchiel 1),
// un œil au centre. Tracé au trait en currentColor pour s'adapter au fond.

const WING_ANGLES = [-58, -12, 34] // paire haute, médiane, basse (côté droit, en degrés)
const FEATHERS_PER_WING = 6
const RINGS = [
  { rx: 44, ry: 15, rotate: 28 },
  { rx: 44, ry: 15, rotate: -28 },
]
const EYES_PER_RING = 8

type Props = {
  className?: string
  title?: string
}

export default function AngelLogo({ className, title = 'Focus Bijouterie' }: Props) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} role="img" aria-label={title}>
      <g fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round">
        {[1, -1].map((side) => (
          <g key={side} transform={`scale(${side} 1)`}>
            {WING_ANGLES.map((angle) => (
              <Wing key={angle} angle={angle} />
            ))}
          </g>
        ))}
      </g>

      <g fill="none" stroke="currentColor" strokeWidth={2}>
        <circle r={30} />
        {RINGS.map((ring) => (
          <ellipse key={ring.rotate} rx={ring.rx} ry={ring.ry} transform={`rotate(${ring.rotate})`} />
        ))}
      </g>

      {RINGS.flatMap((ring) =>
        ringEyes(ring).map((eye, i) => <Eye key={`${ring.rotate}-${i}`} {...eye} size={4.2} />),
      )}
      <Eye x={0} y={0} angle={0} size={13} />
    </svg>
  )
}

function Wing({ angle }: { angle: number }) {
  // Éventail de plumes partant de la racine de l'aile, de la plus longue à la plus courte.
  return (
    <g transform={`translate(22 0) rotate(${angle})`}>
      {Array.from({ length: FEATHERS_PER_WING }, (_, i) => {
        const spread = (i - (FEATHERS_PER_WING - 1) / 2) * 7
        const length = 74 - Math.abs(i - 1.5) * 9
        const width = 7
        return (
          <path
            key={i}
            transform={`rotate(${spread})`}
            d={`M0 0 C${r(length * 0.35)} ${-width} ${r(length * 0.8)} ${-width} ${length} 0 C${r(length * 0.8)} ${width} ${r(length * 0.35)} ${width} 0 0Z`}
          />
        )
      })}
    </g>
  )
}

type EyeProps = { x: number; y: number; angle: number; size: number }

function Eye({ x, y, angle, size }: EyeProps) {
  const h = size * 0.7
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} stroke="currentColor" strokeWidth={size > 8 ? 2 : 1.2}>
      <path d={`M${-size} 0 Q0 ${-h} ${size} 0 Q0 ${h} ${-size} 0Z`} className="fill-paper" />
      <circle r={size * 0.38} fill="currentColor" />
    </g>
  )
}

function ringEyes(ring: (typeof RINGS)[number]): Omit<EyeProps, 'size'>[] {
  const phi = (ring.rotate * Math.PI) / 180
  return Array.from({ length: EYES_PER_RING }, (_, i) => {
    const t = ((i + 0.5) / EYES_PER_RING) * Math.PI * 2
    const ex = ring.rx * Math.cos(t)
    const ey = ring.ry * Math.sin(t)
    // Orientation de l'œil le long de la tangente de l'ellipse.
    const tangent = Math.atan2(ring.ry * Math.cos(t), -ring.rx * Math.sin(t)) + phi
    return {
      x: r(ex * Math.cos(phi) - ey * Math.sin(phi)),
      y: r(ex * Math.sin(phi) + ey * Math.cos(phi)),
      angle: r((tangent * 180) / Math.PI),
    }
  })
}

function r(value: number): number {
  return Math.round(value * 100) / 100
}
