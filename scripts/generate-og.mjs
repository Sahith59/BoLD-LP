// Renders the social share image (public/og.png, 1200x630) from a branded SVG.
// Run with `npm run og`. Uses system fonts via resvg, so no font files are bundled.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="80%" cy="16%" r="58%">
      <stop offset="0%" stop-color="#c77d0a" stop-opacity="0.32"/>
      <stop offset="52%" stop-color="#c77d0a" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#c77d0a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="word" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#cfcfd4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#060608"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="1050" cy="118" r="190" fill="none" stroke="#c77d0a" stroke-opacity="0.16" stroke-width="2"/>
  <circle cx="1050" cy="118" r="124" fill="none" stroke="#c77d0a" stroke-opacity="0.12" stroke-width="2"/>
  <circle cx="1050" cy="118" r="8" fill="#c77d0a"/>
  <text x="82" y="120" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#c77d0a">RUNTIME ASSURANCE FOR AI-CODED APPS</text>
  <text x="78" y="296" font-family="Helvetica, Arial, sans-serif" font-size="152" font-weight="800" fill="url(#word)">B<tspan fill="#c77d0a">o</tspan>LD</text>
  <text x="82" y="412" font-family="Helvetica, Arial, sans-serif" font-size="46" font-weight="700" fill="#ffffff">The runtime alarm for the access bug</text>
  <text x="82" y="470" font-family="Helvetica, Arial, sans-serif" font-size="46" font-weight="700" fill="#ffffff" fill-opacity="0.9">AI-built apps ship by default.</text>
  <g transform="translate(82,536)">
    <rect x="0" y="0" width="214" height="46" rx="23" fill="#c77d0a" fill-opacity="0.12" stroke="#c77d0a" stroke-opacity="0.42"/>
    <circle cx="30" cy="23" r="5.5" fill="#c77d0a"/>
    <text x="50" y="30" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="3" fill="#e8a33d">BETA IS LIVE</text>
  </g>
  <text x="1118" y="566" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="18" font-weight="600" letter-spacing="3" fill="#ffffff" fill-opacity="0.4">ALARM, NOT A SCANNER</text>
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
})
mkdirSync('public', { recursive: true })
writeFileSync('public/og.png', resvg.render().asPng())
console.log('wrote public/og.png')
