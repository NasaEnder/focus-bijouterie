'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Jewel } from '@/types'
import { Scribble } from '@/components/da/Doodles'

type Props = {
  jewels: Jewel[]
}

type LightboxState = {
  jewel: Jewel
  index: number
}

export default function GalleryClient({ jewels }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  const categories = Array.from(
    new Set(jewels.map((j) => j.category).filter(Boolean) as string[]),
  )

  const filtered = activeCategory
    ? jewels.filter((j) => j.category === activeCategory)
    : jewels

  const currentImages = lightbox?.jewel.images ?? []

  const prev = useCallback(() => {
    if (!lightbox || currentImages.length <= 1) return
    setLightbox((lb) => lb && { ...lb, index: (lb.index - 1 + currentImages.length) % currentImages.length })
  }, [lightbox, currentImages.length])

  const next = useCallback(() => {
    if (!lightbox || currentImages.length <= 1) return
    setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % currentImages.length })
  }, [lightbox, currentImages.length])

  useEffect(() => {
    if (!lightbox) return
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, prev, next])

  return (
    <>
      {categories.length > 0 && (
        <div className="flex flex-wrap border-b-2 border-ink font-mono text-xs uppercase">
          <FilterButton active={activeCategory === null} onClick={() => setActiveCategory(null)}>
            Tout
          </FilterButton>
          {categories.map((cat) => (
            <FilterButton
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </FilterButton>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="px-6 py-20 text-center font-mono text-sm uppercase">Aucun bijou dans cette catégorie.</p>
      ) : (
        // Planche contact : filets noirs entre les pièces, comme une grille de shop indé.
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((jewel, i) => {
            const thumb = jewel.images?.[0]
            return (
              <button
                key={jewel.id}
                onClick={() => setLightbox({ jewel, index: 0 })}
                className="group relative border-b-2 border-r-2 border-ink p-3 text-left sm:p-4"
              >
                <div className="relative aspect-square overflow-hidden bg-ink/5">
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={jewel.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase text-ink/40">
                      Pas d&apos;image
                    </div>
                  )}
                </div>
                <Scribble
                  className="pointer-events-none absolute inset-x-0 top-[8%] w-full scale-90 text-fluo-pink opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100"
                  drips={[]}
                />
                <div className="mt-3 flex items-start justify-between gap-2 font-mono text-[11px] uppercase leading-snug sm:text-xs">
                  <div>
                    <p className="text-ink/50">{String(i + 1).padStart(3, '0')}</p>
                    <p className="font-bold">{jewel.title}</p>
                  </div>
                  {jewel.category && (
                    <span className="shrink-0 bg-ink px-1.5 py-0.5 text-paper">{jewel.category}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 font-mono text-xs uppercase text-paper/70 transition-colors hover:text-acid"
            >
              Fermer [x]
            </button>

            <div className="relative aspect-square overflow-hidden border-2 border-paper bg-ink">
              {currentImages[lightbox.index] ? (
                <Image
                  src={currentImages[lightbox.index]}
                  alt={lightbox.jewel.title}
                  fill
                  unoptimized
                  sizes="(max-width: 672px) 100vw, 672px"
                  className="object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase text-paper/50">
                  Pas d&apos;image
                </div>
              )}

              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-paper px-3 py-2 font-mono text-ink transition-colors hover:bg-acid"
                  >
                    ←
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-paper px-3 py-2 font-mono text-ink transition-colors hover:bg-acid"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 flex items-start justify-between gap-4 font-mono text-xs uppercase text-paper">
              <div>
                <p className="font-bold">{lightbox.jewel.title}</p>
                {lightbox.jewel.description && (
                  <p className="mt-1 normal-case text-paper/70">{lightbox.jewel.description}</p>
                )}
              </div>
              {currentImages.length > 1 && (
                <p className="shrink-0 text-paper/50">
                  {lightbox.index + 1} / {currentImages.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`border-r-2 border-ink px-4 py-3 uppercase transition-colors sm:px-6 ${
        active ? 'bg-ink text-paper' : 'hover:bg-acid'
      }`}
    >
      {children}
    </button>
  )
}
