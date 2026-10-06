const ITEMS = ['Bijoux faits main', 'Pièces uniques', 'Sur mesure', 'Commandes ouvertes']

export default function Marquee() {
  // Deux copies côte à côte : la seconde prend la place de la première quand elle sort.
  const run = ITEMS.map((item) => `${item}  ✕  `).join('')
  return (
    <div className="overflow-hidden bg-ink py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper">
      <div className="marquee flex w-max whitespace-pre">
        <span>{run}</span>
        <span aria-hidden>{run}</span>
      </div>
    </div>
  )
}
