import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/* Procedural surface textures — drawn on a canvas, no external assets */
/* ------------------------------------------------------------------ */

function makeTexture(draw) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  draw(ctx, canvas.width, canvas.height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function earthTexture() {
  return makeTexture((ctx, w, h) => {
    ctx.fillStyle = '#1b5fa8'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#2f8f5b'
    for (let i = 0; i < 26; i++) {
      const x = Math.random() * w
      const y = h * 0.25 + Math.random() * h * 0.5
      const r = 8 + Math.random() * 18
      ctx.beginPath()
      ctx.ellipse(x, y, r, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.fillRect(0, 0, w, h * 0.08)
    ctx.fillRect(0, h * 0.92, w, h * 0.08)
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    for (let i = 0; i < 40; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * w, Math.random() * h, 2 + Math.random() * 4, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

function marsTexture() {
  return makeTexture((ctx, w, h) => {
    ctx.fillStyle = '#b5502e'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(90,35,20,0.5)'
    for (let i = 0; i < 400; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.beginPath()
    ctx.ellipse(w / 2, 6, w * 0.12, 6, 0, 0, Math.PI * 2)
    ctx.fill()
  })
}

function craterTexture(base) {
  return makeTexture((ctx, w, h) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const r = 2 + Math.random() * 7
      ctx.fillStyle = `rgba(0,0,0,${0.15 + Math.random() * 0.15})`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

function bandedTexture(colors) {
  return makeTexture((ctx, w, h) => {
    const bands = 10
    for (let i = 0; i < bands; i++) {
      ctx.fillStyle = colors[i % colors.length]
      ctx.fillRect(0, (h / bands) * i, w, h / bands + 1)
    }
  })
}

function venusTexture() {
  return makeTexture((ctx, w, h) => {
    ctx.fillStyle = '#e0b075'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(200,150,90,0.5)'
    ctx.lineWidth = 3
    for (let i = 0; i < 14; i++) {
      ctx.beginPath()
      const y = Math.random() * h
      ctx.moveTo(0, y)
      ctx.bezierCurveTo(w * 0.3, y + 15, w * 0.6, y - 15, w, y)
      ctx.stroke()
    }
  })
}

/* ------------------------------------------------------------------ */
/* Planet configuration                                                */
/* ------------------------------------------------------------------ */

const PLANETS = [
  { name: 'mercury', size: 0.09, distance: 1.3, ecc: 0.02, speed: 0.9, tilt: 0.02, spin: 0.4, texture: () => craterTexture('#9c9284') },
  { name: 'venus', size: 0.14, distance: 1.75, ecc: 0.03, speed: 0.65, tilt: 0.05, spin: 0.2, texture: venusTexture },
  { name: 'earth', size: 0.15, distance: 2.25, ecc: 0.04, speed: 0.5, tilt: 0.41, spin: 1.2, texture: earthTexture, hasMoon: true },
  { name: 'mars', size: 0.11, distance: 2.75, ecc: 0.06, speed: 0.4, tilt: 0.44, spin: 1, texture: marsTexture },
  { name: 'saturn', size: 0.26, distance: 4.1, ecc: 0.03, speed: 0.22, tilt: 0.47, spin: 0.9, hasRing: true, texture: () => bandedTexture(['#e0c088', '#d4b378', '#e8cd96', '#c9a86c']) }
]

/* ------------------------------------------------------------------ */
/* Sun — light source, glowing core, and a soft additive corona        */
/* ------------------------------------------------------------------ */

function Sun() {
  const coreRef = useRef()
  const coronaRef = useRef()

  useFrame((state, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.05
    if (coronaRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.04
      coronaRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshBasicMaterial color="#ffb84c" toneMapped={false} />
      </mesh>
      <mesh ref={coronaRef} scale={1.35}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#ff8a3d" transparent opacity={0.18} toneMapped={false} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3.4} color="#ffcf8c" distance={22} decay={1.6} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Orbit path — elliptical, matching the planet's actual travel curve  */
/* ------------------------------------------------------------------ */

function OrbitPath({ distance, ecc }) {
  const points = useMemo(() => {
    const pts = []
    const rx = distance
    const rz = distance * (1 - ecc)
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * rx, 0, Math.sin(a) * rz))
    }
    return pts
  }, [distance, ecc])

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
    </line>
  )
}

/* ------------------------------------------------------------------ */
/* Moon — orbits its parent planet in the planet's own local space     */
/* ------------------------------------------------------------------ */

function Moon() {
  const orbitRef = useRef()

  useFrame((state) => {
    const angle = state.clock.elapsedTime * 2.2
    if (orbitRef.current) {
      orbitRef.current.position.set(Math.cos(angle) * 0.26, Math.sin(angle * 0.5) * 0.03, Math.sin(angle) * 0.26)
    }
  })

  return (
    <group ref={orbitRef}>
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#cfcfd6" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Saturn's ring — two-tone for a bit of banding                       */
/* ------------------------------------------------------------------ */

function PlanetRing({ size }) {
  return (
    <group rotation={[Math.PI / 2.3, 0, 0]}>
      <mesh>
        <ringGeometry args={[size * 1.4, size * 1.75, 64]} />
        <meshStandardMaterial color="#d8c39a" side={THREE.DoubleSide} transparent opacity={0.8} roughness={0.85} />
      </mesh>
      <mesh>
        <ringGeometry args={[size * 1.8, size * 2.2, 64]} />
        <meshStandardMaterial color="#bfa578" side={THREE.DoubleSide} transparent opacity={0.6} roughness={0.85} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Planet — elliptical orbit, axial tilt, own spin, textured surface   */
/* ------------------------------------------------------------------ */

function Planet({ config }) {
  const orbitRef = useRef()
  const spinRef = useRef()
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const texture = useMemo(() => config.texture(), [config])

  useFrame((state, delta) => {
    const angle = state.clock.elapsedTime * config.speed + phase
    const rx = config.distance
    const rz = config.distance * (1 - config.ecc)
    if (orbitRef.current) {
      orbitRef.current.position.set(Math.cos(angle) * rx, 0, Math.sin(angle) * rz)
    }
    if (spinRef.current) spinRef.current.rotation.y += delta * config.spin
  })

  return (
    <group ref={orbitRef}>
      <group ref={spinRef} rotation={[0, 0, config.tilt]}>
        <mesh>
          <sphereGeometry args={[config.size, 40, 40]} />
          <meshStandardMaterial map={texture} roughness={0.85} metalness={0.03} />
        </mesh>
        {config.hasRing && <PlanetRing size={config.size} />}
      </group>
      {config.hasMoon && <Moon />}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Asteroid belt — a scattered ring band between Mars and Saturn        */
/* ------------------------------------------------------------------ */

function AsteroidBelt({ count = 140 }) {
  const ref = useRef()

  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 3.15 + Math.random() * 0.5,
        y: (Math.random() - 0.5) * 0.15,
        speed: 0.05 + Math.random() * 0.05
      })),
    [count]
  )

  const positions = useMemo(() => new Float32Array(count * 3), [count])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    data.forEach((a, i) => {
      const angle = a.angle + t * a.speed
      positions[i * 3] = Math.cos(angle) * a.radius
      positions[i * 3 + 1] = a.y
      positions[i * 3 + 2] = Math.sin(angle) * a.radius
    })
    if (ref.current) ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#9c9284" transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/* Starfield backdrop                                                  */
/* ------------------------------------------------------------------ */

function Starfield({ count = 500 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 9 + Math.random() * 12
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/* Scene assembly                                                      */
/* ------------------------------------------------------------------ */

function Scene({ scrollProgress }) {
  const groupRef = useRef()

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.025
    groupRef.current.position.y = -scrollProgress.current * 1.4
    const scale = 1 - Math.min(scrollProgress.current, 0.5) * 0.3
    groupRef.current.scale.setScalar(scale)
  })

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      <Sun />
      {PLANETS.map((p) => (
        <group key={p.name}>
          <OrbitPath distance={p.distance} ecc={p.ecc} />
          <Planet config={p} />
        </group>
      ))}
      <AsteroidBelt />
    </group>
  )
}

function CameraRig({ scrollProgress }) {
  useFrame((state) => {
    const targetZ = 7 - scrollProgress.current * 1.2
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.5, 0.03)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

export default function Scene3D({ scrollProgress }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full h-full">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 pointer-events-none ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="w-10 h-10 rounded-full border-2 border-white/15 border-t-accent-violet animate-spin" />
      </div>

      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
          setLoaded(true)
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.14} />

          <Scene scrollProgress={scrollProgress} />
          <CameraRig scrollProgress={scrollProgress} />
          <Starfield />

          <Environment preset="studio" />

          <EffectComposer>
            <Bloom intensity={0.6} luminanceThreshold={0.7} luminanceSmoothing={0.3} mipmapBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}