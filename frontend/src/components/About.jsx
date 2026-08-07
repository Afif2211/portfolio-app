import { motion } from 'framer-motion'

const experience = [
  {
    role: 'MERN Stack Developer',
    company: 'LambdaDevs Inc., Toronto',
    points: [
      'Built a full-stack e-commerce platform with real-time inventory tracking and integrated payments, contributing to a 20% increase in client sales',
      'Built an enterprise productivity app with collaboration tools and analytics dashboards',
      'Slashed API response times by 40% and improved frontend load speed'
    ]
  },
  {
    role: 'MERN Stack Intern',
    company: 'SoftSquare, Lahore',
    points: [
      'Shipped core CMS features that boosted application reliability by 25%',
      'Improved MongoDB data integration by 30% through debugging and optimization',
      'Cut client issue resolution time by 20%'
    ]
  },
  {
    role: 'Frontend Developer Intern',
    company: 'The Spark Foundation, Islamabad',
    points: ['Designed and built the Spark Student Portal frontend in React']
  }
]

const skills = [
  'React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript',
  'Tailwind CSS', 'REST APIs', 'Socket.io', 'Git', 'Python'
]

export default function About() {
  return (
    <section id="about" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-medium mb-2">
          About <span className="gradient-text">me</span>
        </h2>
        <p className="text-white/60 max-w-2xl mb-14">
          Computer Science graduate (Air University, Islamabad) with 2+ years of experience
          building scalable full-stack applications — from real-time platforms to
          performance-critical dashboards.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            {experience.map((job, i) => (
              <motion.div
                key={job.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="gradient-card p-6"
              >
                <h3 className="font-medium">{job.role}</h3>
                <p className="text-sm text-accent-blue font-mono mb-3">{job.company}</p>
                <ul className="space-y-1.5 text-sm text-white/60 list-disc list-inside">
                  {job.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="gradient-card p-6 h-fit"
          >
            <h3 className="font-medium mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}