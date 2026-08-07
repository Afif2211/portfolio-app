import { useEffect, useRef } from 'react'

export default function useScrollProgress() {
  const progressRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      progressRef.current = docHeight > 0 ? scrollTop / docHeight : 0
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progressRef
}