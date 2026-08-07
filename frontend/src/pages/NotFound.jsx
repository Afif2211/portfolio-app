import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFound() {
  const orbRef = useRef(null)

  useEffect(() => {
    let frameId
    let t = 0
    const animate = () => {
      t += 0.002
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${Math.sin(t) * 30}px, ${Math.cos(t * 0.8) * 20}px)`
      }
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero px-6">
      <div ref={orbRef} className="glow-orb w-[500px] h-[500px] bg-accent-violet top-1/4 left-1/4" />
      <div className="glow-orb w-[380px] h-[380px] bg-accent-blue bottom-0 right-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-lg"
      >
        <p className="font-mono text-sm text-accent-blue mb-4">Error 404</p>

        <h1 className="text-7xl sm:text-8xl font-medium tracking-tight mb-6 gradient-text">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-medium mb-4">
          This page drifted off course
        </h2>

        <p className="text-white/60 mb-10">
          The page you're looking for doesn't exist, or may have moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-gradient-border text-white font-medium hover:opacity-90 transition-opacity"
          >
            Back to home
          </Link>

          <a
            href="/#contact"
            className="px-6 py-3 rounded-full border border-white/15 hover:border-accent-violet transition-colors"
          >
            Contact me
          </a>
        </div>
      </motion.div>
    </section>
  )
}