import type { Jewel } from '@/types'
import GalleryClient from './GalleryClient'

type Props = {
  jewels: Jewel[]
}

export default function Gallery({ jewels }: Props) {
  return (
    <section id="galerie" className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-10 text-center">Galerie</h2>
        {jewels.length === 0 ? (
          <p className="text-center text-gray-400">Aucun bijou disponible pour le moment.</p>
        ) : (
          <GalleryClient jewels={jewels} />
        )}
      </div>
    </section>
  )
}
