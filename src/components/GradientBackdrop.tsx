import { MeshGradient } from '@paper-design/shaders-react'

// Isolated so the heavy WebGL shader package can be lazy-loaded behind a plain
// black fallback, keeping it out of the initial bundle.
export default function GradientBackdrop() {
  return (
    <MeshGradient
      className="h-full w-full"
      colors={['#000000', '#1a1a1a', '#333333', '#ffffff']}
      speed={0.8}
      backgroundColor="#000000"
    />
  )
}
