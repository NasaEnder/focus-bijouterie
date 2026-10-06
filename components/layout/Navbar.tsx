import Link from 'next/link'
import AngelLogo from '@/components/da/AngelLogo'

const LINKS = [
  { href: '#galerie', label: 'Drop' },
  { href: '#apropos', label: 'Atelier' },
  { href: '#contact', label: 'Commander' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <nav className="flex h-14 items-stretch justify-between">
        <Link href="/" className="flex items-center gap-2 px-4">
          <AngelLogo className="w-9 text-ink" />
          <span className="font-display text-2xl uppercase">Focus</span>
        </Link>
        <ul className="flex font-mono text-xs uppercase">
          {LINKS.map((link) => (
            <li key={link.href} className="flex border-l-2 border-ink">
              <a href={link.href} className="flex items-center px-3 transition-colors hover:bg-ink hover:text-paper sm:px-6">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
