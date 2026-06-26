import { handleContact } from './_contact'

// Vercel Edge function: receives contact-form messages with minimal cold start.
export const config = { runtime: 'edge' }

export default function handler(request: Request): Promise<Response> {
  return handleContact(request)
}
