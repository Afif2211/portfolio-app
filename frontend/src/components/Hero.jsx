import { useRef, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import TypewriterHeading from './TypewriterHeading.jsx'
import useScrollProgress from '../hooks/useScrollProgress.js'

const Scene3D = lazy(() => import('./Scene3D.jsx'))

const stats = [
  { value: '2+', label: 'Years experience' },
  { value: '2', label: 'Shipped products' },
  { value: '10+', label: 'Technologies' }
]

export default function Hero() {
  const scrollProgress = useScrollProgress()
  const orbTopRef = useRef(null)
  const orbBottomRef = useRef(null)

  useEffect(() => {
    let frameId
    const animate = () => {
      const p = scrollProgress.current
      if (orbTopRef.current) orbTopRef.current.style.transform = `translateY(${p * 120}px)`
      if (orbBottomRef.current) orbBottomRef.current.style.transform = `translateY(${-p * 80}px)`
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [scrollProgress])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      <div ref={orbTopRef} className="glow-orb w-[500px] h-[500px] bg-accent-violet -top-40 -left-40" />
      <div ref={orbBottomRef} className="glow-orb w-[400px] h-[400px] bg-accent-blue top-1/3 right-0" />

      <div className="relative max-w-6xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
            <span className="font-mono text-xs text-white/70">Open to full-stack roles</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-tight mb-6">
            <TypewriterHeading
              segments={[
                { text: 'Building ' },
                { text: 'scalable,', gradient: true },
                { break: true },
                { text: 'high-performance' },
                { break: true },
                { text: 'web apps' }
              ]}
              speed={28}
              startDelay={300}
            />
          </h1>

          <p className="text-white/60 mb-10 max-w-md text-lg">
            Computer Science graduate specializing in full-stack development —
            from real-time trading platforms to Airbnb-style marketplaces.
          </p>

          <div className="flex flex-wrap gap-4 mb-14">
            <a
              href="#projects"
              className="px-6 py-3 rounded-full bg-gradient-border text-white font-medium hover:opacity-90 transition-opacity"
            >
              View my work
            </a>

            <a
              href="#contact"
              className="px-6 py-3 rounded-full border border-white/15 hover:border-accent-violet transition-colors"
            >
              Contact me
            </a>
          </div>

          <div className="flex gap-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-medium gradient-text">{stat.value}</p>
                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="h-[340px] sm:h-[500px] lg:h-[620px]">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-white/15 border-t-accent-violet animate-spin" />
              </div>
            }
          >
            <Scene3D scrollProgress={scrollProgress} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}