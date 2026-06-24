import { handleSubscribe } from './_subscribe'

// Vercel Edge function: captures early-access signups with minimal cold start.
export const config = { runtime: 'edge' }

export default function handler(request: Request): Promise<Response> {
  return handleSubscribe(request)
}
