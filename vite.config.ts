import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { handleChat } from './api/_chat'

/**
 * Load the local .env into process.env, with the FILE taking precedence over any
 * ambient variable. Vite's convention is the opposite (ambient wins), but for a
 * server secret in local dev the file should be the source of truth: a stale key
 * inherited from the shell or editor must never silently override the one you put
 * in .env. Only runs in dev; production reads the real env on Vercel directly.
 */
function loadDotenvOverride() {
  for (const file of ['.env', '.env.local']) {
    const path = resolve(process.cwd(), file)
    if (!existsSync(path)) continue
    for (const raw of readFileSync(path, 'utf8').split('\n')) {
      const line = raw.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      const value = line
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, '')
      if (key) process.env[key] = value
    }
  }
}

/**
 * Dev-only: mount the same Groq proxy handler used by the Vercel Edge function
 * at /api/chat, so streaming works at localhost:5173 without `vercel dev`.
 */
function devApi(): Plugin {
  return {
    name: 'bold-dev-api',
    apply: 'serve',
    configureServer(server) {
      loadDotenvOverride()

      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) {
            if (typeof v === 'string') headers.set(k, v)
            else if (Array.isArray(v)) headers.set(k, v.join(', '))
          }

          const chunks: Buffer[] = []
          for await (const c of req) chunks.push(c as Buffer)
          const body = Buffer.concat(chunks)

          const request = new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers,
            body: req.method === 'POST' && body.length ? body : undefined,
          })

          const response = await handleChat(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))

          if (response.body) {
            const reader = response.body.getReader()
            for (;;) {
              const { done, value } = await reader.read()
              if (done) break
              res.write(Buffer.from(value))
            }
          }
          res.end()
        } catch (err) {
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: 'dev_proxy', detail: String(err) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApi()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
