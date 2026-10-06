// Tags à la bombe posés par-dessus les peintures : le côté vandale de la DA.
// Traits épais passés dans le filtre #spray (voir SprayDefs), avec coulures.

// Coulure : [x, y de départ, longueur] dans l'espace du viewBox.
type DripSpec = [number, number, number]

type DoodleProps = {
  className?: string
  strokeWidth?: number
  // Remplace les coulures par défaut ([] pour aucune).
  drips?: DripSpec[]
}

function Doodle({
  viewBox,
  paths,
  defaultDrips = [],
  className,
  strokeWidth = 7,
  drips = defaultDrips,
}: DoodleProps & { viewBox: string; paths: string[]; defaultDrips?: DripSpec[] }) {
  return (
    <svg viewBox={viewBox} className={className} aria-hidden overflow="visible">
      <g
        filter="url(#spray)"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
        {drips.map(([x, y, length], i) => (
          <g
            key={i}
            className="drip"
            style={{ transformBox: 'fill-box', animationDelay: `${0.3 + i * 0.25}s` }}
          >
            <path d={`M${x} ${y} V${y + length}`} strokeWidth={strokeWidth * 0.45} />
            <circle cx={x} cy={y + length} r={strokeWidth * 0.32} fill="currentColor" stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  )
}

export function Halo(props: DoodleProps) {
  return (
    <Doodle
      viewBox="0 0 100 40"
      paths={['M12 22 C8 8 88 4 92 18 C96 32 18 38 8 24 C4 16 30 8 62 9']}
      defaultDrips={[[20, 31, 14], [70, 33, 22]]}
      strokeWidth={5}
      {...props}
    />
  )
}

export function Arrow(props: DoodleProps) {
  return (
    <Doodle
      viewBox="0 0 120 80"
      paths={['M6 10 C30 4 70 14 88 58', 'M70 50 L89 61 L96 40']}
      defaultDrips={[[40, 12, 16]]}
      {...props}
    />
  )
}

export function Underline(props: DoodleProps) {
  return (
    <Doodle
      viewBox="0 0 200 24"
      paths={['M4 14 C50 6 110 18 196 8']}
      defaultDrips={[[46, 11, 14], [150, 12, 22]]}
      {...props}
    />
  )
}

export function RingDoodle(props: DoodleProps) {
  return (
    <Doodle
      viewBox="0 0 100 110"
      paths={[
        'M50 46 C76 44 84 70 72 88 C60 104 30 102 22 82 C14 62 28 47 50 46Z',
        'M36 34 L50 18 L64 34 L50 46Z',
      ]}
      defaultDrips={[[40, 98, 16], [66, 94, 10]]}
      strokeWidth={6}
      {...props}
    />
  )
}

// Cercle griffonné, pour entourer.
export function Scribble(props: DoodleProps) {
  return (
    <Doodle
      viewBox="0 0 200 80"
      paths={['M100 6 C40 2 6 22 8 42 C10 64 70 78 130 72 C182 66 198 40 186 24 C172 6 120 4 70 10']}
      defaultDrips={[[60, 72, 18], [150, 70, 12]]}
      strokeWidth={5}
      {...props}
    />
  )
}

export function Star(props: DoodleProps) {
  return (
    <Doodle
      viewBox="0 0 100 100"
      paths={['M50 6 L60 38 L94 38 L66 58 L77 92 L50 71 L23 92 L34 58 L6 38 L40 38Z']}
      defaultDrips={[[50, 72, 18]]}
      strokeWidth={6}
      {...props}
    />
  )
}
