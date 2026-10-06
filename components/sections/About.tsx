import Image from 'next/image'
import { Arrow, RingDoodle } from '@/components/da/Doodles'
import SprayTag from '@/components/da/SprayTag'

export default function About() {
  return (
    <section id="apropos" className="grid border-b-2 border-ink md:grid-cols-[1.3fr_1fr]">
      {/* Tags placés en % de l'image (ratio conservé) : la bague tombe entre les deux doigts. */}
      <div className="halftone relative overflow-hidden border-b-2 border-ink md:border-b-0 md:border-r-2">
        <Image
          src="/da/michel-ange-mains.jpg"
          alt="Les mains de Dieu et d'Adam, Michel-Ange, photocopiées, avec une bague taguée entre les doigts"
          width={1400}
          height={1047}
          sizes="(max-width: 768px) 100vw, 56vw"
          className="xerox h-auto w-full"
        />
        <RingDoodle className="absolute left-[41%] top-[18%] z-10 w-[15%] text-fluo-pink" />
        <Arrow className="absolute bottom-[26%] right-[25%] z-10 w-[17%] -scale-x-100 -rotate-[100deg] text-orange" drips={[]} />
        <SprayTag
          className="absolute bottom-[10%] right-[5%] z-10 -rotate-6 text-[9vw] text-orange md:text-[5vw]"
          drips={[[20, 0.4], [62, 0.7]]}
        >
          fait main
        </SprayTag>
      </div>

      <div className="flex flex-col justify-end gap-6 px-4 py-12 sm:px-6">
        <p className="font-mono text-xs uppercase text-ink/60">[ 02 ] L’atelier</p>
        <h2 className="font-display text-6xl uppercase leading-[0.85] sm:text-8xl">
          Une pièce,
          <br />
          deux mains.
        </h2>
        <div className="space-y-3 font-mono text-sm leading-relaxed">
          <p>Portrait et histoire du bijoutier à compléter avec le client.</p>
          <p>Texte de présentation, formation, inspiration, matériaux utilisés…</p>
        </div>
      </div>
    </section>
  )
}
