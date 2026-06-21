'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import * as THREE from 'three'

const FONT = '/fonts/helvetiker_bold.typeface.json'
const SIZE = 1.34
const DEPTH = 0.52
const WORD = 'BoLD'

// Optical letter-spacing (world units). Base tracking between every pair,
// plus a small extra before D — an L's open foot needs more room after it.
const TRACK = 0.03
const EXTRA_BEFORE: Record<string, number> = { D: 0.055 }

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3)
}

function Logo({ refractTex }: { refractTex: THREE.Texture | null }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const font = useLoader(FontLoader, FONT) as any
  const group = useRef<THREE.Group>(null!)
  const intro = useRef(0)

  const { geometry, wordWidth } = useMemo(() => {
    const opts = {
      font,
      size: SIZE,
      depth: DEPTH,
      curveSegments: 40,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.065,
      bevelOffset: 0,
      bevelSegments: 30,
    }
    const scale = SIZE / font.data.resolution

    const parts: THREE.BufferGeometry[] = []
    let cursor = 0
    for (let i = 0; i < WORD.length; i++) {
      const ch = WORD[i]
      if (i > 0) cursor += TRACK
      cursor += EXTRA_BEFORE[ch] ?? 0
      const g = new TextGeometry(ch, opts)
      g.translate(cursor, 0, 0)
      parts.push(g)
      cursor += font.data.glyphs[ch].ha * scale
    }

    const geo = mergeGeometries(parts, false)!
    geo.computeBoundingBox()
    const b = geo.boundingBox!
    geo.translate(
      -(b.min.x + b.max.x) / 2,
      -(b.min.y + b.max.y) / 2,
      -(b.min.z + b.max.z) / 2,
    )
    return { geometry: geo, wordWidth: b.max.x - b.min.x }
  }, [font])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    intro.current = Math.min(1, intro.current + delta / 1.3)
    const e = easeOutCubic(intro.current)

    const k = 1 - Math.pow(0.0016, delta)
    const sway = Math.sin(t * 0.4) * 0.06
    const targetY = state.pointer.x * 0.3 + sway + (1 - e) * 0.5
    const targetX = -state.pointer.y * 0.15 + Math.sin(t * 0.55) * 0.018
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, k)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, k)

    // Auto-fit the wordmark to the viewport width so it never overflows
    // (full-size on desktop, scales down on narrow / mobile).
    const fit = Math.min(1, (state.viewport.width * 0.84) / wordWidth)
    const breathe = 1 + Math.sin(t * 0.85) * 0.014
    // Title size lever: 0.72 = 20% smaller than the earlier 0.9, to free room
    // so the whole hero (down to the CTA) fits in the opening screen.
    const s = (0.82 + 0.18 * e) * breathe * fit * 0.72
    g.scale.setScalar(s)
    // Lift into the upper area so it never collides with the headline below.
    const narrow = state.viewport.width < 6
    const restY = narrow ? 0.35 : 1.08
    g.position.y = restY + (1 - e) * -0.4
  })

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <MeshTransmissionMaterial
          samples={8}
          resolution={1024}
          transmission={1}
          thickness={0.62}
          roughness={0.04}
          ior={1.45}
          chromaticAberration={0.12}
          anisotropy={0.1}
          distortion={0.2}
          distortionScale={0.35}
          temporalDistortion={0.03}
          clearcoat={1}
          clearcoatRoughness={0.04}
          attenuationColor="#ffffff"
          attenuationDistance={8}
          color="#ffffff"
          background={refractTex ?? undefined}
        />
      </mesh>
    </group>
  )
}

function Studio() {
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={4} position={[0, 2.4, 4]} scale={[9, 0.5, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={2.6} position={[-1.5, -1.8, 4]} rotation-z={Math.PI / 7} scale={[6, 0.35, 1]} color="#eef1f8" />
      <Lightformer intensity={1.3} rotation-y={Math.PI / 2} position={[-5, 0, 1]} scale={[6, 6, 1]} color="#9aa3b8" />
      <Lightformer intensity={1.3} rotation-y={-Math.PI / 2} position={[5, 0, 1]} scale={[6, 6, 1]} color="#9aa3b8" />
    </Environment>
  )
}

function Scene({ gradientCanvas }: { gradientCanvas: HTMLCanvasElement | null }) {
  const tex = useMemo(() => {
    if (!gradientCanvas) return null
    const t = new THREE.CanvasTexture(gradientCanvas)
    t.colorSpace = THREE.SRGBColorSpace
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    return t
  }, [gradientCanvas])

  useFrame(() => {
    if (tex) tex.needsUpdate = true
  })

  return (
    <Suspense fallback={null}>
      <Logo refractTex={tex} />
      <Studio />
    </Suspense>
  )
}

export default function BoldLogo3D({
  gradientCanvas,
}: {
  gradientCanvas: HTMLCanvasElement | null
}) {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      dpr={[1, 2]}
      camera={{ position: [0, 0.1, 7.6], fov: 32 }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[-6, 3, 4]} intensity={1.1} color="#cfd6e6" />
      <Scene gradientCanvas={gradientCanvas} />
    </Canvas>
  )
}
