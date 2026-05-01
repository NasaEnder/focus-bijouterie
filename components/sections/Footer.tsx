export default function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-gray-100">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Focus Bijouterie. Tous droits réservés.</p>
        <div className="flex gap-6">
          {/* Liens réseaux sociaux à ajouter */}
          <a href="#" className="hover:text-gray-600 transition-colors">Instagram</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Mentions légales</a>
        </div>
      </div>
    </footer>
  )
}
