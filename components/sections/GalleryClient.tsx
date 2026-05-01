'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Jewel } from '@/types'

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
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <FilterButton active={activeCategory === null} onClick={() => setActiveCategory(null)}>
            Tous
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
        <p className="text-center text-gray-400">Aucun bijou dans cette catégorie.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filtered.map((jewel) => {
            const thumb = jewel.images?.[0]
            return (
              <button
                key={jewel.id}
                onClick={() => setLightbox({ jewel, index: 0 })}
                className="group bg-white rounded-lg overflow-hidden border border-gray-100 text-left hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={jewel.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">
                      Pas d'image
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800">{jewel.title}</p>
                  {jewel.category && (
                    <p className="text-xs text-gray-400 mt-0.5">{jewel.category}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm transition-colors"
            >
              Fermer ✕
            </button>

            <div className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden">
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
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
                  Pas d'image
                </div>
              )}

              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white text-xl hover:bg-black/70 transition-colors"
                  >
                    ‹
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white text-xl hover:bg-black/70 transition-colors"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {currentImages.length > 1 && (
              <p className="text-center text-white/50 text-xs mt-2">
                {lightbox.index + 1} / {currentImages.length}
              </p>
            )}

            <div className="mt-4 text-white">
              <p className="font-medium">{lightbox.jewel.title}</p>
              {lightbox.jewel.description && (
                <p className="text-sm text-white/60 mt-1">{lightbox.jewel.description}</p>
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
      className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
        active
          ? 'bg-gray-900 text-white border-gray-900'
          : 'border-gray-200 text-gray-600 hover:border-gray-400'
      }`}
    >
      {children}
    </button>
  )
}
