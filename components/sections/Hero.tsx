import Image from 'next/image'
import { Underline } from '@/components/da/Doodles'

export default function Hero() {
  return (
    <section className="border-b-2 border-ink">
      {/* Ciel au-dessus des nuages, détail de La Bataille d'Alexandre à Issos d'Altdorfer (1529). */}
      {/* Bandeau large sur desktop ; plus haut sur mobile, recadré sur le soleil. */}
      <div className="halftone relative aspect-[4/3] overflow-hidden border-b-2 border-ink sm:aspect-[5/2]">
        <Image
          src="/da/altdorfer-ciel.jpg"
          alt="Un ciel tourbillonnant au-dessus d'une mer de nuages, le soleil perçant à l'horizon (détail d'Altdorfer, 1529)"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_60%]"
        />
      </div>

      <div className="grid gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
        <h1 className="font-display text-[19vw] uppercase leading-[0.82] md:text-[11vw]">
          Bijoux
          <br />
          <span className="relative inline-block">
            faits main
            <Underline className="absolute left-0 top-[92%] w-full text-fluo-pink" strokeWidth={9} />
          </span>
        </h1>
        <div className="max-w-xs font-mono text-sm uppercase leading-relaxed">
          <p>Pièces uniques, sur mesure. Dessinées avec toi, fabriquées à l’atelier, une par une.</p>
          <a href="#contact" className="btn-raw mt-6">
            Commander une pièce →
          </a>
        </div>
      </div>
    </section>
  )
}
