'use client'

import { useEffect, useRef } from 'react'

type NeuralNoiseProps = {
  color?: [number, number, number]
  opacity?: number
  speed?: number
}

const VERT = `
  precision mediump float;
  varying vec2 vUv;
  attribute vec2 a_position;
  void main() {
    vUv = 0.5 * (a_position + 1.0);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FRAG = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform vec2 u_pointer_position;
  uniform vec3 u_color;
  uniform float u_speed;
  vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
  }
  float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.0);
    vec2 res = vec2(0.0);
    float scale = 8.0;
    for (int j = 0; j < 15; j++) {
      uv = rotate(uv, 1.0);
      sine_acc = rotate(sine_acc, 1.0);
      vec2 layer = uv * scale + float(j) + sine_acc - t;
      sine_acc += sin(layer) + 2.4 * p;
      res += (0.5 + 0.5 * cos(layer)) / scale;
      scale *= 1.2;
    }
    return res.x + res.y;
  }
  void main() {
    vec2 uv = 0.5 * vUv;
    uv.x *= u_ratio;
    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float p = clamp(length(pointer), 0.0, 1.0);
    p = 0.5 * pow(1.0 - p, 2.0);
    float t = u_speed * u_time;
    vec3 col = vec3(0.0);
    float noise = neuro_shape(uv, t, p);
    noise = 1.2 * pow(noise, 3.0);
    noise += pow(noise, 10.0);
    noise = max(0.0, noise - 0.5);
    noise *= (1.0 - length(vUv - 0.5));
    col = u_color * noise;
    gl_FragColor = vec4(col, noise);
  }
`

function compile(gl: WebGLRenderingContext, src: string, type: number) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  return sh
}

export function NeuralNoise({
  color = [0.9, 0.2, 0.4],
  opacity = 0.95,
  speed = 0.001,
}: NeuralNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return

    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl, VERT, gl.VERTEX_SHADER))
    gl.attachShader(program, compile(gl, FRAG, gl.FRAGMENT_SHADER))
    gl.linkProgram(program)
    gl.useProgram(program)

    const u = {
      time: gl.getUniformLocation(program, 'u_time'),
      ratio: gl.getUniformLocation(program, 'u_ratio'),
      pointer: gl.getUniformLocation(program, 'u_pointer_position'),
      color: gl.getUniformLocation(program, 'u_color'),
      speed: gl.getUniformLocation(program, 'u_speed'),
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    gl.uniform3f(u.color, color[0], color[1], color[2])
    gl.uniform1f(u.speed, speed)

    const dpr = Math.min(window.devicePixelRatio, 2)
    const pointer = { x: 0, y: 0, tX: 0, tY: 0 }

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      gl.uniform1f(u.ratio, canvas.width / canvas.height)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()

    let raf = 0
    const render = () => {
      pointer.x += (pointer.tX - pointer.x) * 0.18
      pointer.y += (pointer.tY - pointer.y) * 0.18
      gl.uniform1f(u.time, performance.now())
      gl.uniform2f(u.pointer, pointer.x / window.innerWidth, 1 - pointer.y / window.innerHeight)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(render)
    }
    render()

    const onMove = (e: PointerEvent) => {
      pointer.tX = e.clientX
      pointer.tY = e.clientY
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [color, speed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
      }}
    />
  )
}
