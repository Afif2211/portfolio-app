export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
        <p>© {new Date().getFullYear()} Afif Ahmad</p>
        <div className="flex gap-6">
          <a href="https://github.com/Afif2211" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            GitHub
          </a>
          <a href="https://linkedin.com/in/theafifkhan" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            LinkedIn
          </a>
          <a href="mailto:afifbalouch@gmail.com" className="hover:text-white transition-colors">
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
