// Filtre « bombe de peinture », déclaré une fois dans le layout racine et utilisé via
// `filter: url(#spray)` (SVG ou HTML) : bord rugueux, halo de pulvérisation et
// particules projetées autour du trait.
export default function SprayDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <filter id="spray" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          {/* Bord irrégulier du trait. */}
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="rough" />

          {/* Halo de pulvérisation autour du trait. */}
          <feGaussianBlur in="rough" stdDeviation="3.5" result="haze" />
          <feComponentTransfer in="haze" result="softHaze">
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>

          {/* Particules : du bruit seuillé, gardé seulement là où il y a du halo. */}
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="3" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 14 -8.4" result="dots" />
          <feComposite in="haze" in2="dots" operator="in" result="speckle" />
          <feComponentTransfer in="speckle" result="speckles">
            <feFuncA type="linear" slope="2.2" />
          </feComponentTransfer>

          <feMerge>
            <feMergeNode in="softHaze" />
            <feMergeNode in="speckles" />
            <feMergeNode in="rough" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}
