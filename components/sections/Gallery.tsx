import type { Jewel } from '@/types'
import GalleryClient from './GalleryClient'
import SprayTag from '@/components/da/SprayTag'

type Props = {
  jewels: Jewel[]
}

export default function Gallery({ jewels }: Props) {
  return (
    <section id="galerie">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink px-4 pb-6 pt-14 sm:px-6">
        <h2 className="relative font-display text-7xl uppercase leading-none sm:text-9xl">
          Drop 01
          <SprayTag
            className="absolute -right-6 -top-6 rotate-12 text-3xl text-fluo-pink sm:-right-16 sm:text-5xl"
            drips={[[30, 0.5], [70, 0.3]]}
          >
            uniques!
          </SprayTag>
        </h2>
        <p className="font-mono text-xs uppercase leading-relaxed">
          {jewels.length} pièces / une seule de chaque
          <br />
          quand c’est parti, c’est parti
        </p>
      </div>
      {jewels.length === 0 ? (
        <p className="px-6 py-20 text-center font-mono text-sm uppercase">Aucun bijou disponible pour le moment.</p>
      ) : (
        <GalleryClient jewels={jewels} />
      )}
    </section>
  )
}
