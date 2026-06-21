import { handleChat } from './_chat'

// Vercel Edge function: streams Groq tokens with minimal cold-start latency.
export const config = { runtime: 'edge' }

export default function handler(request: Request): Promise<Response> {
  return handleChat(request)
}
