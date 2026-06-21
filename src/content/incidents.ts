// Single source of truth for the real-incident record. Consumed by the
// /incidents page (full write-ups), the chat's source chips (verified links),
// and the bot's system prompt (grounded knowledge). Edit facts here only.

export type Incident = {
  id: string
  name: string
  date: string
  stat: string
  statLabel: string
  how: string
  note?: string
  sources: { label: string; url: string }[]
}

export const INCIDENTS: Incident[] = [
  {
    id: 'mcdonalds',
    name: 'McDonald’s hiring AI (McHire / Paradox.ai)',
    date: '2025',
    stat: 'Up to 64M',
    statLabel: 'records exposed',
    how: 'Researchers Ian Carroll and Sam Curry found a test admin account using the password "123456" with no MFA. From there, an insecure direct object reference on an internal API: decrementing the applicant ID returned other applicants’ chat transcripts and contact info. Patched the same day.',
    note: 'Paradox.ai disputes the "applicant" framing and says only five records were actually viewed by the researchers. We use "records exposed," not "stolen."',
    sources: [
      { label: 'CSO Online', url: 'https://www.csoonline.com/article/4020919' },
      {
        label: 'Dark Reading',
        url: 'https://www.darkreading.com/application-security/lessons-learned-mcdonalds-ai-flub',
      },
    ],
  },
  {
    id: 'intel',
    name: 'Intel "Intel Outside"',
    date: '2024',
    stat: '~270K',
    statLabel: 'employee records exposed via the flaw',
    how: 'Researcher Eaton Zveare bypassed a client-side login on Intel’s India business-card site by editing a JavaScript function, reaching an unauthenticated API that returned a ~1GB JSON file of the global employee directory: names, roles, managers, phone numbers. Four internal sites were affected. Reported Oct 2024, remediated by Feb 2025.',
    note: 'Intel states there was no malicious access. This was a researcher-found vulnerability, exposed via the flaw and remediated, not a criminal breach.',
    sources: [
      {
        label: 'SecurityWeek',
        url: 'https://www.securityweek.com/intel-employee-data-exposed-by-vulnerabilities/',
      },
      {
        label: "Tom's Hardware",
        url: 'https://www.tomshardware.com/tech-industry/cyber-security/researcher-downloaded-the-data-of-all-270-000-intel-employees-from-an-internal-business-card-website-massive-data-breach-dubbed-intel-outside-didnt-qualify-for-bug-bounty',
      },
    ],
  },
  {
    id: 'lovable',
    name: 'Lovable',
    date: '2025 · CVE-2025-48757',
    stat: '170+',
    statLabel: 'apps exposed, row-level security off',
    how: 'A researcher scanned 1,645 Lovable-built apps and found 170 with critical row-level-security failures; roughly 70% had RLS disabled entirely. Anyone could query private tables directly using the public API key.',
    note: 'A separate Lovable API flaw was formally classified as Broken Object Level Authorization, the exact category BoLD watches for.',
    sources: [
      {
        label: 'The Next Web',
        url: 'https://thenextweb.com/news/lovable-vibe-coding-security-crisis-exposed',
      },
      {
        label: 'The Register',
        url: 'https://www.theregister.com/2026/02/27/lovable_app_vulnerabilities',
      },
    ],
  },
  {
    id: 'tea',
    name: 'Tea',
    date: '2025',
    stat: '72K images',
    statLabel: 'plus 1.1M private messages exposed',
    how: 'An unsecured legacy storage system exposed 72,000 images, including 13,000 selfies and government IDs. A second flaw on the messaging system exposed more than 1.1 million private messages.',
    sources: [
      {
        label: 'TechCrunch',
        url: 'https://techcrunch.com/2025/07/26/dating-safety-app-tea-breached-exposing-72000-user-images',
      },
      { label: 'The Week', url: 'https://theweek.com/tech/tea-app-hack' },
    ],
  },
  {
    id: 'moltbook',
    name: 'Moltbook',
    date: '2026',
    stat: '1.5M tokens',
    statLabel: 'plus 35K emails exposed',
    how: 'A vibe-coded app (the founder wrote no code) shipped with a misconfigured Supabase database and Row Level Security turned off, giving full read and write access to all data. Wiz found it in minutes via a Supabase key sitting in the client-side JavaScript.',
    sources: [
      {
        label: 'Wiz',
        url: 'https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys',
      },
      {
        label: 'Techzine',
        url: 'https://www.techzine.eu/news/security/138458/moltbook-database-exposes-35000-emails-and-1-5-million-api-keys/',
      },
    ],
  },
]
