'use client'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-semibold text-lg tracking-wide">Focus Bijouterie</span>
        <ul className="flex gap-8 text-sm text-gray-600">
          <li><a href="#galerie" className="hover:text-gray-900 transition-colors">Galerie</a></li>
          <li><a href="#apropos" className="hover:text-gray-900 transition-colors">À propos</a></li>
          <li><a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a></li>
        </ul>
      </nav>
    </header>
  )
}
