import { useState } from 'react'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-base/60 border-b border-border">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="font-display text-lg font-medium">
          Afif<span className="gradient-text">.dev</span>
        </a>

        <ul className="hidden sm:flex items-center gap-8 text-sm text-white/70">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="mailto:afifbalouch@gmail.com"
          className="hidden sm:inline-block text-sm px-4 py-2 rounded-full border border-white/15 hover:border-accent-violet hover:text-white transition-colors"
        >
          Get in touch
        </a>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full border border-white/15"
        >
          {open ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="sm:hidden border-t border-border px-6 py-4 flex flex-col gap-4 bg-base/95">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}

          <a
            href="mailto:afifbalouch@gmail.com"
            onClick={() => setOpen(false)}
            className="text-sm px-4 py-2 rounded-full border border-white/15 text-center hover:border-accent-violet transition-colors"
          >
            Get in touch
          </a>
        </div>
      )}
    </header>
  )
}