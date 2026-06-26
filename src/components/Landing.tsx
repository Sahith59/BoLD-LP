import { Hero } from '@/components/sections/Hero'
import { InvoiceStory } from '@/components/sections/InvoiceStory'
import { WhatItCatches } from '@/components/sections/WhatItCatches'
import { Incidents } from '@/components/sections/Incidents'
import { AlarmVsScanner } from '@/components/sections/AlarmVsScanner'
import { Proof } from '@/components/sections/Proof'
import { Promise as PromiseSection } from '@/components/sections/Promise'
import { HowItPlugsIn } from '@/components/sections/HowItPlugsIn'
import { Roadmap } from '@/components/sections/Roadmap'
import { WhoFor } from '@/components/sections/WhoFor'
import { FounderNote } from '@/components/sections/FounderNote'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'

export function Landing({
  gradientCanvas,
  onCta,
  reduce,
}: {
  gradientCanvas: HTMLCanvasElement | null
  onCta: () => void
  reduce: boolean | null
}) {
  return (
    <>
      <Hero gradientCanvas={gradientCanvas} onCta={onCta} reduce={reduce} />
      <InvoiceStory reduce={reduce} />
      <WhatItCatches />
      <Incidents />
      <AlarmVsScanner />
      <Proof />
      <PromiseSection />
      <HowItPlugsIn />
      <Roadmap />
      <WhoFor />
      <FounderNote />
      <FAQ />
      <FinalCTA />
    </>
  )
}
