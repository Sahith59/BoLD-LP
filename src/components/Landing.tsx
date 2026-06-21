import { Hero } from '@/components/sections/Hero'
import { InvoiceStory } from '@/components/sections/InvoiceStory'
import { Incidents } from '@/components/sections/Incidents'
import { AlarmVsScanner } from '@/components/sections/AlarmVsScanner'
import { Proof } from '@/components/sections/Proof'
import { Promise as PromiseSection } from '@/components/sections/Promise'
import { WhoFor } from '@/components/sections/WhoFor'
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
      <Incidents />
      <AlarmVsScanner />
      <Proof />
      <PromiseSection />
      <WhoFor />
      <FinalCTA />
    </>
  )
}
