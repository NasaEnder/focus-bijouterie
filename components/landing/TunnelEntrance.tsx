'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Spiral from './Spiral'
import AngelLogo from '@/components/da/AngelLogo'
import { Halo, Star } from '@/components/da/Doodles'
import SprayTag from '@/components/da/SprayTag'

const DESTINATION = '/menu'
const TUNNEL_MS = 2100
const LIGHT_DELAY_MS = 1300
const LIGHT_MS = 900
const REDUCED_MOTION_FADE_MS = 400
const SKY_ZOOM = 4

export default function TunnelEntrance() {
  const router = useRouter()
  const skyRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  const tunnelStart = useRef<number | null>(null)
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    router.prefetch(DESTINATION)
  }, [router])

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    if (entering) return
    setEntering(true)

    const light = lightRef.current
    if (!light) return router.push(DESTINATION)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await light.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: REDUCED_MOTION_FADE_MS,
        fill: 'forwards',
      }).finished
      return router.push(DESTINATION)
    }

    // Le canvas lit cet horodatage à chaque frame et déroule le tunnel.
    tunnelStart.current = performance.now()

    // La coupole fonce vers nous en même temps que la spirale.
    skyRef.current?.animate([{ transform: 'scale(1)' }, { transform: `scale(${SKY_ZOOM})` }], {
      duration: TUNNEL_MS,
      easing: 'cubic-bezier(0.55, 0, 0.9, 0.4)',
      fill: 'forwards',
    })

    // La lumière au bout du tunnel : un point blanc au centre qui grandit jusqu'à remplir l'écran.
    await light.animate(
      [
        { opacity: 0, transform: 'scale(0.03)' },
        { opacity: 1, transform: 'scale(0.12)', offset: 0.3 },
        { opacity: 1, transform: 'scale(2.5)' },
      ],
      { delay: LIGHT_DELAY_MS, duration: LIGHT_MS, easing: 'ease-in', fill: 'forwards' },
    ).finished

    router.push(DESTINATION)
  }

  return (
    <>
      {/* Coupole de Correggio photocopiée : un tourbillon céleste dont la lumière tombe pile sur « Entrer ». */}
      <div ref={skyRef} aria-hidden className="absolute inset-0 overflow-hidden will-change-transform">
        <div className="sky-drift absolute left-1/2 top-1/2 size-[150vmax] -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/da/correggio-coupole.jpg"
            alt=""
            fill
            priority
            sizes="150vmax"
            className="xerox object-cover object-[50%_44%] opacity-45"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgb(14_14_14/0.3)_45%,rgb(14_14_14/0.9)_100%)]"
      />

      <Spiral tunnelStart={tunnelStart} tunnelMs={TUNNEL_MS} />

      <AngelLogo className="fade-in-late absolute left-1/2 top-5 w-20 -translate-x-1/2 rounded-full bg-ink p-2 text-paper sm:w-24" />
      <p className="fade-in-late absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-paper">
        bijoux faits main / pièces uniques
      </p>

      <div className="absolute inset-0 flex items-center justify-center">
        <Link
          href={DESTINATION}
          onClick={handleClick}
          aria-disabled={entering}
          className={`fade-in-late group relative px-10 py-8 text-6xl text-fluo-pink -rotate-6 transition-[rotate,scale,opacity] duration-300 hover:rotate-0 hover:scale-110 focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-acid sm:text-7xl ${
            entering ? 'opacity-0! pointer-events-none' : ''
          }`}
        >
          <Halo className="absolute -top-6 left-1/2 w-44 -translate-x-1/2 text-acid sm:w-52" />
          <Star className="absolute -right-4 top-2 w-10 text-acid transition-transform duration-500 group-hover:rotate-45" drips={[]} />
          <SprayTag className="relative" drips={[[18, 0.5], [55, 0.8], [82, 0.35]]}>Entrer</SprayTag>
        </Link>
      </div>

      <div
        ref={lightRef}
        aria-hidden
        className="pointer-events-none absolute inset-[-50vmax] opacity-0 will-change-transform bg-[radial-gradient(circle_closest-side,#ffffff_0%,#ecebe4_45%,transparent_100%)]"
      />
    </>
  )
}
