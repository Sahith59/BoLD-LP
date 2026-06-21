/**
 * SVG displacement filter that warps whatever sits behind a glass surface —
 * the same liquid-glass refraction as the 3D BoLD title, in CSS. Applied via
 * `backdrop-filter: url(#liquid-glass)` on .glass-panel. Rendered once, hidden.
 */
export function GlassFilter() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0 }}
    >
      <defs>
        <filter
          id="liquid-glass"
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.009"
            numOctaves="2"
            seed="11"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2.5" result="soft" />

          {/* Chromatic aberration: bend each colour channel by a different
              amount, like the 3D title's IOR split, then recombine. */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="26"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dR"
          />
          <feColorMatrix
            in="dR"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="cR"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dG"
          />
          <feColorMatrix
            in="dG"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="cG"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dB"
          />
          <feColorMatrix
            in="dB"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="cB"
          />
          <feBlend in="cR" in2="cG" mode="screen" result="rg" />
          <feBlend in="rg" in2="cB" mode="screen" />
        </filter>

        {/* Stronger, clearer refraction for the Section-2 refractive panels:
            bigger, smoother lens warps + wider chromatic split than the frosted
            cards, so the background visibly bends through like the 3D title. */}
        <filter
          id="glass-refract-strong"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.008"
            numOctaves="2"
            seed="7"
            result="n"
          />
          <feGaussianBlur in="n" stdDeviation="2" result="ns" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="ns"
            scale="42"
            xChannelSelector="R"
            yChannelSelector="G"
            result="rR"
          />
          <feColorMatrix
            in="rR"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="rcR"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="ns"
            scale="34"
            xChannelSelector="R"
            yChannelSelector="G"
            result="rG"
          />
          <feColorMatrix
            in="rG"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="rcG"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="ns"
            scale="26"
            xChannelSelector="R"
            yChannelSelector="G"
            result="rB"
          />
          <feColorMatrix
            in="rB"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="rcB"
          />
          <feBlend in="rcR" in2="rcG" mode="screen" result="rrg" />
          <feBlend in="rrg" in2="rcB" mode="screen" />
        </filter>

        {/* Crystal edge: even heavier bend + wider chromatic dispersion, for the
            pronounced glass-edge A/B option. */}
        <filter
          id="glass-edge-crystal"
          x="-45%"
          y="-45%"
          width="190%"
          height="190%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004 0.006"
            numOctaves="2"
            seed="4"
            result="cn"
          />
          <feGaussianBlur in="cn" stdDeviation="1.5" result="cns" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="cns"
            scale="64"
            xChannelSelector="R"
            yChannelSelector="G"
            result="eR"
          />
          <feColorMatrix
            in="eR"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="ecR"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="cns"
            scale="50"
            xChannelSelector="R"
            yChannelSelector="G"
            result="eG"
          />
          <feColorMatrix
            in="eG"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="ecG"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="cns"
            scale="36"
            xChannelSelector="R"
            yChannelSelector="G"
            result="eB"
          />
          <feColorMatrix
            in="eB"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="ecB"
          />
          <feBlend in="ecR" in2="ecG" mode="screen" result="erg" />
          <feBlend in="erg" in2="ecB" mode="screen" />
        </filter>
      </defs>
    </svg>
  )
}
