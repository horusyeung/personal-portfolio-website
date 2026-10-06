'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/*
 * Liquid Glass showpiece. WebGL draws both the background (a slow iOS-style wallpaper) and the
 * glass, so the refraction works in every browser, Safari included. The glass is a rounded
 * rectangle with a curved rim: light bends at the edge (lensing), splits slightly by colour
 * (chromatic aberration), picks up a specular highlight, and the body stretches with velocity
 * while it is dragged, like iOS 26's fluid controls.
 */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uRes;      // canvas size in px
uniform float uTime;
uniform vec2 uCenter;   // glass centre in px (y down)
uniform vec2 uHalf;     // glass half size in px
uniform float uRadius;  // corner radius in px
uniform vec2 uStretch;  // velocity-based squash and stretch
uniform float uDark;    // 0 light, 1 dark
uniform float uDpr;
uniform vec2 uBlob;     // the trailing droplet's centre in px
uniform float uBlobR;   // and its radius

// Soft flowing colour bands, in the spirit of the iOS 26 and macOS 26 wallpapers
vec3 wallpaper(vec2 uv) {
  float t = uTime * 0.05;
  vec2 q = uv;
  q.x += 0.18 * sin(q.y * 3.1 + t * 2.0);
  q.y += 0.14 * sin(q.x * 2.3 - t * 1.6);
  float band = sin((q.x * 1.3 + q.y * 2.2) * 6.0 + t * 3.0);
  vec3 blue = vec3(0.04, 0.47, 1.0);
  vec3 violet = vec3(0.55, 0.36, 0.96);
  vec3 pink = vec3(1.0, 0.33, 0.55);
  vec3 amber = vec3(1.0, 0.62, 0.20);
  vec3 a = mix(blue, violet, smoothstep(-0.2, 1.0, q.x));
  vec3 b = mix(pink, amber, smoothstep(0.0, 1.0, q.y));
  vec3 col = mix(a, b, 0.5 + 0.5 * sin(q.x * 2.0 - q.y * 1.5 + t));
  col = mix(col, col * 0.78, smoothstep(0.55, 1.0, band));     // band shading gives the glass edges to bend
  col += 0.08 * smoothstep(0.92, 1.0, band);
  vec3 bg = mix(vec3(0.985), vec3(0.03), uDark);
  return mix(bg, col, mix(0.85, 0.92, uDark));
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// The pill and the droplet, smoothly unioned so they melt into each other like liquid
float scene(vec2 px) {
  vec2 local = (px - uCenter) / uStretch;
  float pill = sdRoundBox(local, uHalf, uRadius) * min(uStretch.x, uStretch.y);
  float drop = length(px - uBlob) - uBlobR;
  return smin(pill, drop, 34.0);
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 res = uRes / uDpr;
  vec2 uv = px / res.y;
  float d = scene(px);

  // Outside: wallpaper plus a soft shadow under the glass
  if (d > 1.0) {
    vec3 col = wallpaper(uv);
    float shadow = exp(-max(scene(px - vec2(0.0, 14.0)), 0.0) / 26.0);
    col *= 1.0 - 0.22 * shadow;
    outColor = vec4(col, 1.0);
    return;
  }

  // Surface normal from the SDF gradient
  float e = 1.0;
  vec2 g = normalize(vec2(
    scene(px + vec2(e, 0.0)) - scene(px - vec2(e, 0.0)),
    scene(px + vec2(0.0, e)) - scene(px - vec2(0.0, e))
  ) + 1e-5);

  // Rim profile: a circular bevel, flat in the middle and steep at the edge
  float bevel = min(uHalf.y, 34.0);
  float t = clamp(-d / bevel, 0.0, 1.0);
  float slope = 1.0 - sqrt(1.0 - (1.0 - t) * (1.0 - t));
  vec2 bend = -g * slope * bevel * 0.85;                    // sample from further in: edge lensing
  vec2 sampleUv = (px + bend - (px - uCenter) * 0.06) / res.y; // and a slight overall magnification

  // Chromatic aberration grows towards the rim; a light frost from a few taps
  vec2 ca = g * slope * 2.2 / res.y;
  vec3 col = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    float a = float(i) * 1.2566;
    vec2 o = vec2(cos(a), sin(a)) * 1.6 / res.y;
    col.r += wallpaper(sampleUv + o + ca).r;
    col.g += wallpaper(sampleUv + o).g;
    col.b += wallpaper(sampleUv + o - ca).b;
  }
  col /= 5.0;

  // Tint, specular highlight from the top left, and a thin bright rim
  col = mix(col, mix(vec3(1.0), vec3(0.12), uDark), mix(0.10, 0.18, uDark));
  vec2 light = normalize(vec2(-0.6, -0.8));
  float spec = pow(slope, 2.0) * max(dot(g, light), 0.0);
  col += spec * mix(0.55, 0.35, uDark);
  float rim = smoothstep(1.5, 0.0, abs(d + 0.75));
  col += rim * mix(0.35, 0.25, uDark);
  float lowRim = pow(slope, 3.0) * max(dot(g, -light), 0.0);
  col -= lowRim * 0.08;

  float alpha = smoothstep(1.0, -1.0, d);
  vec3 outside = wallpaper(uv);
  outColor = vec4(mix(outside, col, alpha), 1.0);
}`

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader')
  return shader
}

export default function LiquidGlassCanvas({
  height = 520,
  glass = { w: 380, h: 96, r: 48 },
  children,
}: {
  height?: number
  glass?: { w: number; h: number; r: number }
  children?: ReactNode
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const [webgl, setWebgl] = useState(true)

  useEffect(() => {
    const cv = canvas.current!
    const box = wrap.current!
    const gl = cv.getContext('webgl2', { antialias: false, premultipliedAlpha: false })
    if (!gl) {
      setWebgl(false)
      return
    }
    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(program)
    gl.useProgram(program)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const u = (n: string) => gl.getUniformLocation(program, n)
    const U = {
      res: u('uRes'),
      time: u('uTime'),
      center: u('uCenter'),
      half: u('uHalf'),
      radius: u('uRadius'),
      blob: u('uBlob'),
      blobR: u('uBlobR'),
      stretch: u('uStretch'),
      dark: u('uDark'),
      dpr: u('uDpr'),
    }

    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const dark = () => (document.documentElement.classList.contains('dark') ? 1 : 0)
    let dpr = 1
    let w = 0
    let h = 0
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2)
      w = box.clientWidth
      h = box.clientHeight
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      gl.viewport(0, 0, cv.width, cv.height)
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(box)

    // Spring-follow state: the glass eases towards its target and stretches with velocity
    const pos = { x: w / 2, y: h / 2 }
    const target = { x: w / 2, y: h / 2 }
    const vel = { x: 0, y: 0 }
    // The droplet rests against the pill's right end and follows on a softer spring, so a quick
    // drag stretches the liquid bridge between them until it snaps
    const blobOffset = { x: glass.w / 2 + 26, y: glass.h * 0.28 }
    const blob = { x: pos.x + blobOffset.x, y: pos.y + blobOffset.y }
    const blobVel = { x: 0, y: 0 }
    let dragging = false
    let start = 0
    const onDown = (ev: PointerEvent) => {
      const r = box.getBoundingClientRect()
      const x = ev.clientX - r.left
      const y = ev.clientY - r.top
      if (Math.abs(x - pos.x) < glass.w / 2 + 12 && Math.abs(y - pos.y) < glass.h / 2 + 12) {
        dragging = true
        box.setPointerCapture(ev.pointerId)
      }
    }
    const onMove = (ev: PointerEvent) => {
      if (!dragging) return
      const r = box.getBoundingClientRect()
      target.x = Math.min(Math.max(ev.clientX - r.left, glass.w / 2), w - glass.w / 2)
      target.y = Math.min(Math.max(ev.clientY - r.top, glass.h / 2), h - glass.h / 2)
    }
    const onUp = () => (dragging = false)
    box.addEventListener('pointerdown', onDown)
    box.addEventListener('pointermove', onMove)
    box.addEventListener('pointerup', onUp)
    box.addEventListener('pointercancel', onUp)

    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!start) start = now
      // Critically damped-ish spring
      const k = 180
      const c = 2 * Math.sqrt(k) * 0.9
      vel.x += ((target.x - pos.x) * k - vel.x * c) * dt
      vel.y += ((target.y - pos.y) * k - vel.y * c) * dt
      pos.x += vel.x * dt
      pos.y += vel.y * dt
      const speed = Math.min(Math.hypot(vel.x, vel.y) / 2400, 0.18)
      const sx = 1 + (speed * Math.abs(vel.x)) / (Math.hypot(vel.x, vel.y) + 1e-3) - speed * 0.5
      const sy = 1 + (speed * Math.abs(vel.y)) / (Math.hypot(vel.x, vel.y) + 1e-3) - speed * 0.5
      gl.uniform2f(U.res, cv.width, cv.height)
      gl.uniform1f(U.time, reduced.matches ? 8 : (now - start) / 1000)
      gl.uniform2f(U.center, pos.x, pos.y)
      gl.uniform2f(U.half, glass.w / 2, glass.h / 2)
      gl.uniform1f(U.radius, glass.r)
      gl.uniform2f(U.stretch, sx, sy)
      gl.uniform1f(U.dark, dark())
      gl.uniform1f(U.dpr, dpr)
      const bk = 38
      const bc = 2 * Math.sqrt(bk) * 0.55
      blobVel.x += ((pos.x + blobOffset.x - blob.x) * bk - blobVel.x * bc) * dt
      blobVel.y += ((pos.y + blobOffset.y - blob.y) * bk - blobVel.y * bc) * dt
      blob.x += blobVel.x * dt
      blob.y += blobVel.y * dt
      gl.uniform2f(U.blob, blob.x, blob.y)
      gl.uniform1f(U.blobR, glass.h * 0.34)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (label.current) {
        label.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${sx}, ${sy})`
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      box.removeEventListener('pointerdown', onDown)
      box.removeEventListener('pointermove', onMove)
      box.removeEventListener('pointerup', onUp)
      box.removeEventListener('pointercancel', onUp)
    }
  }, [glass.w, glass.h, glass.r])

  return (
    <div
      ref={wrap}
      style={{
        position: 'relative',
        height,
        borderRadius: 28,
        overflow: 'hidden',
        touchAction: 'none',
        cursor: 'grab',
        background: webgl
          ? undefined
          : 'linear-gradient(120deg, #0a84ff, #8e5cf5 40%, #ff5a8a 70%, #ff9f33)',
      }}
    >
      <canvas
        ref={canvas}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden
      />
      <div
        ref={label}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: glass.w,
          height: glass.h,
          display: 'grid',
          placeItems: 'center',
          pointerEvents: 'none',
          transform: 'translate(50%, 50%)',
          // Without WebGL, fall back to Apple's web glass recipe
          ...(webgl
            ? {}
            : {
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: glass.r,
                background: 'rgba(255,255,255,0.35)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 10px 30px rgba(0,0,0,0.18)',
              }),
        }}
      >
        {children}
      </div>
    </div>
  )
}
