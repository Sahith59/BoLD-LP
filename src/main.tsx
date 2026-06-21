import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// The landing page must always open at the hero. Stop the browser from restoring
// the previous scroll position on reload (with Lenis + the tall 3D hero, an "auto"
// restore lands the user at the bottom of the page on hard refresh).
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
