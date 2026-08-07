import { useRef } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../data/projects.js'

function TiltCard({ children, className }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = ((y / rect.height) - 0.5) * -10
    const rotateY = ((x / rect.width) - 0.5) * 10
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`
    card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`)
    card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`)
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-sm text-accent-blue mb-3">Selected work</p>
        <h2 className="text-4xl sm:text-5xl font-medium tracking-tight mb-2">
          Featured <span className="gradient-text">projects</span>
        </h2>
        <p className="text-white/50 mb-14 max-w-xl">
          Two full-stack projects covering fintech-style dashboards and marketplace platforms.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: '1000px' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <TiltCard className="tilt-card gradient-card p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-border opacity-60" />

                <span className="font-mono text-xs text-white/30 mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3 className="text-2xl font-medium mb-3">{project.name}</h3>

                <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5">
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-accent-blue hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}