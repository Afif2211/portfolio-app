import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative py-28 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-medium mb-2">
          Let's <span className="gradient-text">talk</span>
        </h2>
        <p className="text-white/60 mb-10">
          Open to full-stack roles and freelance work — reach out below.
        </p>

        <form onSubmit={handleSubmit} className="gradient-card p-6 space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-violet transition-colors"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your email"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-violet transition-colors"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your message"
            rows={4}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-violet transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="px-6 py-3 rounded-full bg-gradient-border font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'sent' && <p className="text-sm text-accent-blue">Message sent — thanks!</p>}
          {status === 'error' && <p className="text-sm text-accent-magenta">Something went wrong. Try again.</p>}
        </form>
      </div>
    </section>
  )
}
