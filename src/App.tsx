'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  frame,
  cancelFrame,
} from 'motion/react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import Lenis from 'lenis'
import { MeshGradient } from '@paper-design/shaders-react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { GlassFilter } from '@/components/GlassFilter'
import { BoldChat } from '@/components/BoldChat'
import { Landing } from '@/components/Landing'
import { IncidentsPage } from '@/components/IncidentsPage'
import { ComparePage } from '@/components/ComparePage'

function Shell() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const gradWrapRef = useRef<HTMLDivElement>(null)
  const [gradCanvas, setGradCanvas] = useState<HTMLCanvasElement | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Apple-style weighted scroll. Driven by Motion's frameloop so it stays in
  // perfect sync with every useScroll-based animation. Off for reduced motion.
  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
    lenisRef.current = lenis
    const update = (data: { timestamp: number }) => lenis.raf(data.timestamp)
    frame.update(update, true)
    return () => {
      cancelFrame(update)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduce])

  // Grab the MeshGradient's WebGL canvas so the hero glass can refract it
  useEffect(() => {
    let raf = 0
    const find = () => {
      const c = gradWrapRef.current?.querySelector(
        'canvas',
      ) as HTMLCanvasElement | null
      if (c) setGradCanvas(c)
      else raf = requestAnimationFrame(find)
    }
    find()
    return () => cancelAnimationFrame(raf)
  }, [])

  // On navigation, jump to the linked incident (if a hash) or back to the top.
  useEffect(() => {
    const toTop = () => {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }
    if (location.hash) {
      const id = location.hash.slice(1)
      window.setTimeout(() => {
        const el = document.getElementById(id)
        if (!el) return toTop()
        if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -90 })
        else el.scrollIntoView()
      }, 90)
      return
    }
    toTop()
  }, [location.pathname, location.hash])

  const scrollToCta = () => {
    const doScroll = () => {
      const el = document.getElementById('early-access')
      if (!el) return
      if (lenisRef.current)
        lenisRef.current.scrollTo(el, { offset: 0, duration: 1.4 })
      else
        el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }
    if (location.pathname !== '/') {
      navigate('/')
      window.setTimeout(doScroll, 140)
    } else {
      doScroll()
    }
  }

  // Logo click: return to the top of the home page (or route home first). Without
  // this, clicking the logo while already on "/" is a no-op and never scrolls up.
  const goHome = () => {
    if (location.pathname !== '/') {
      navigate('/')
      return
    }
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.2 })
    else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <main className="relative w-full text-white">
      <GlassFilter />

      {/* Fixed atmosphere: flowing monochrome gradient + veil + grain */}
      <div ref={gradWrapRef} className="fixed inset-0 z-0">
        <MeshGradient
          className="h-full w-full"
          colors={['#000000', '#1a1a1a', '#333333', '#ffffff']}
          speed={0.8}
          backgroundColor="#000000"
        />
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-black/10 via-black/35 to-black/55" />
      <div className="grain pointer-events-none fixed inset-0 z-0 opacity-[0.05]" />

      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="bg-accent fixed inset-x-0 top-0 z-50 h-0.5 origin-left"
      />

      <Nav onCta={scrollToCta} onHome={goHome} />

      <Routes>
        <Route
          path="/"
          element={
            <Landing
              gradientCanvas={gradCanvas}
              onCta={scrollToCta}
              reduce={reduce}
            />
          }
        />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>

      <Footer />
      <BoldChat />
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
