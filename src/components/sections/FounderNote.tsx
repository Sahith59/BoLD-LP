import { motion } from 'motion/react'
import { Section } from '@/components/ui/section'
import { GlassPanel } from '@/components/ui/glass-panel'
import { rise } from '@/lib/motion'

// SCAFFOLD: this is placeholder founder voice, true to the mission but generic.
// Swap the body and the signature for the founder's own words and name before
// launch. Keep it short and first-person; this is the human trust anchor.
export function FounderNote() {
  return (
    <Section index="11" eyebrow="WHY WE’RE BUILDING THIS">
      <GlassPanel className="px-7 py-12 md:px-14 md:py-16">
        <motion.div
          variants={rise}
          className="space-y-5 text-[16px] leading-[1.7] text-white/75 md:text-[18px]"
        >
          <p>
            I kept watching the same thing happen. Someone ships an app in a
            weekend, the demo is flawless, and then the second real user signs
            up and can read the first one’s data. Not because anyone did
            anything wrong. Because the code checks that you are{' '}
            <span className="text-white">logged in</span>, and never checks that
            the data is <span className="text-white">yours</span>.
          </p>
          <p>
            Scanners run before launch and miss it. The logs show a clean{' '}
            <span className="font-mono text-[15px] text-white/85">200 OK</span>.
            It stays invisible until it is a headline.
          </p>
          <p>
            So we are building the one thing that was missing: an alarm that
            sits in the live request and tells you the instant a real user
            reaches something that was never theirs. In plain English, with the
            fix, before it becomes the story.
          </p>
          <p className="text-white/85">
            We would rather earn ten teams who would be genuinely upset if we
            disappeared than chase a wall of logos.
          </p>
        </motion.div>

        <motion.div
          variants={rise}
          className="mt-9 flex items-center gap-3 border-t border-white/10 pt-6"
        >
          <span className="bg-accent/20 text-accent grid h-9 w-9 place-items-center rounded-full font-display text-[15px] font-semibold">
            B
          </span>
          <div className="text-[13.5px] leading-tight">
            <div className="font-medium text-white">The BoLD team</div>
            <div className="text-white/45">Founders, BoLD</div>
          </div>
        </motion.div>
      </GlassPanel>
    </Section>
  )
}
