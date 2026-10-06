import AngelLogo from '@/components/da/AngelLogo'
import SprayTag from '@/components/da/SprayTag'

const CREDITS = [
  {
    label: 'Altdorfer, La Bataille d’Alexandre à Issos (1529), détail, domaine public',
    href: 'https://commons.wikimedia.org/wiki/File:Albrecht_Altdorfer_-_Schlacht_bei_Issus_(Alte_Pinakothek,_M%C3%BCnchen)_-_Google_Art_Project.jpg',
  },
  {
    label: 'Michel-Ange, La Création d’Adam (v. 1512), domaine public',
    href: 'https://commons.wikimedia.org/wiki/File:Creation_of_Adam_(Michelangelo)_Detail.jpg',
  },
  {
    label: 'Mantegna, Camera degli Sposi : photo Sailko, CC BY 3.0',
    href: 'https://commons.wikimedia.org/wiki/File:Andrea_mantegna,_camera_degli_sposi,_1465-74,_volta,_01.jpg',
  },
  {
    label: 'Correggio, Assomption, Parme : photo Livioandronico2013, CC BY-SA 4.0',
    href: 'https://commons.wikimedia.org/wiki/File:Cathedral_(Parma)_-_Assumption_by_Correggio.jpg',
  },
]

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t-2 border-ink">
      <div className="relative border-b-2 border-ink px-2">
        <p aria-hidden className="font-display text-[31vw] uppercase leading-[0.8] tracking-tight">
          Focus
        </p>
        <SprayTag
          className="absolute bottom-[12%] right-[6%] -rotate-12 text-[8vw] text-fluo-pink"
          drips={[[30, 0.5], [75, 0.3]]}
        >
          bijoux
        </SprayTag>
      </div>
      <div className="grid gap-8 px-4 py-8 font-mono text-[11px] uppercase sm:grid-cols-3 sm:px-6">
        <div className="flex items-center gap-3">
          <AngelLogo className="w-12 text-ink" />
          <p>
            © {new Date().getFullYear()} Focus Bijouterie
            <br />
            Bijoux faits main
          </p>
        </div>
        <div className="flex flex-col gap-1">
          {/* Liens réseaux sociaux à ajouter */}
          <a href="#" className="w-fit hover:bg-acid">Instagram ↗</a>
          <a href="#" className="w-fit hover:bg-acid">Mentions légales</a>
        </div>
        <ul className="space-y-1 normal-case text-ink/50">
          {CREDITS.map((credit) => (
            <li key={credit.href}>
              <a href={credit.href} target="_blank" rel="noreferrer" className="hover:text-ink">
                {credit.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
