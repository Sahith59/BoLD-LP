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
  {
    id: 'first-american',
    name: 'First American Financial',
    date: '2019',
    stat: '~885M',
    statLabel: 'documents exposed',
    how: 'A document-retrieval link used a sequential ID and required no login at all. Changing the number in the URL returned anyone’s records: bank account numbers, Social Security numbers, mortgage and wire-transfer paperwork, going back to 2003. A textbook insecure direct object reference, at the scale of hundreds of millions of files.',
    note: 'Reported by Brian Krebs after a real-estate developer flagged it; New York’s financial regulator later brought charges. We say "exposed," not "stolen."',
    sources: [
      {
        label: 'Krebs on Security',
        url: 'https://krebsonsecurity.com/2019/05/first-american-financial-corp-leaked-hundreds-of-millions-of-title-insurance-records/',
      },
      {
        label: 'SecurityWeek',
        url: 'https://www.securityweek.com/first-american-financial-exposed-millions-sensitive-documents/',
      },
    ],
  },
  {
    id: 'usps',
    name: 'USPS "Informed Visibility"',
    date: '2018',
    stat: '~60M',
    statLabel: 'users exposed via the flaw',
    how: 'The API confirmed you were logged in but never checked the data was yours. Any usps.com account could query other users’ details, email, address, phone number, and in some cases modify them. The exact ownership-check failure BoLD watches for, at sixty million users.',
    note: 'USPS said it had no evidence the flaw was ever used criminally. Reported by Brian Krebs.',
    sources: [
      {
        label: 'Krebs on Security',
        url: 'https://krebsonsecurity.com/2018/11/usps-site-exposed-data-on-60-million-users/',
      },
      {
        label: 'SecurityWeek',
        url: 'https://www.securityweek.com/us-postal-service-api-flaw-exposes-data-60-million-customers/',
      },
    ],
  },
  {
    id: 'peloton',
    name: 'Peloton',
    date: '2021',
    stat: 'Any account',
    statLabel: 'queryable, even private profiles',
    how: 'Peloton’s API answered requests for account data without checking the caller was allowed to see it, returning age, gender, city, weight and workout stats even for profiles the user had set to private. Found by Pen Test Partners, and closed only after TechCrunch asked about it.',
    sources: [
      {
        label: 'TechCrunch',
        url: 'https://techcrunch.com/2021/05/05/peloton-bug-account-data-leak/',
      },
      {
        label: 'Security Magazine',
        url: 'https://www.securitymagazine.com/articles/95146-pelotons-api-exposes-riders-private-data',
      },
    ],
  },
  {
    id: 'github',
    name: 'GitHub / Ruby on Rails',
    date: '2012',
    stat: 'Repo write',
    statLabel: 'access gained via one extra field',
    how: 'Researcher Egor Homakov added a hidden field to the SSH-key form (a mass-assignment flaw) to bind his key to another account, then committed straight to the Ruby on Rails repository. The server trusted request parameters it should never have accepted. Privilege escalation from a single unchecked field.',
    note: 'Homakov disclosed it by proving it on the Rails repo. GitHub patched it within hours and reinstated his account. The canonical mass-assignment case.',
    sources: [
      {
        label: 'The Register',
        url: 'https://www.theregister.com/2012/03/05/github_hack/',
      },
      { label: 'Homakov', url: 'http://homakov.blogspot.com/2012/03/how-to.html' },
    ],
  },
]
