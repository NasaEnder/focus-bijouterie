// Mot tagué à la bombe : police de tag, filtre #spray et coulures qui descendent.

type Props = {
  children: React.ReactNode
  className?: string
  // Coulures : [position horizontale en %, longueur en em].
  drips?: [number, number][]
}

export default function SprayTag({ children, className = '', drips = [] }: Props) {
  return (
    // Pas de position imposée : passer `relative` ou `absolute` dans className (les coulures en ont besoin).
    <span className={`inline-block font-tag leading-none [filter:url(#spray)] ${className}`}>
      {children}
      {drips.map(([left, length], i) => (
        <span
          key={left}
          aria-hidden
          className="drip absolute top-[78%] w-[0.06em] rounded-b-full bg-current"
          style={{ left: `${left}%`, height: `${length}em`, animationDelay: `${0.4 + i * 0.3}s` }}
        />
      ))}
    </span>
  )
}
