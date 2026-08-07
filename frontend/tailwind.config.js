/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#09090b',
        surface: '#111114',
        border: 'rgba(255,255,255,0.08)',
        accent: {
          violet: '#7c5cff',
          blue: '#3ab7ff',
          magenta: '#ff5ca8'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      backgroundImage: {
        'gradient-hero': 'radial-gradient(circle at 20% 20%, rgba(124,92,255,0.25), transparent 40%), radial-gradient(circle at 80% 30%, rgba(58,183,255,0.2), transparent 40%), radial-gradient(circle at 50% 80%, rgba(255,92,168,0.15), transparent 40%)',
        'gradient-text': 'linear-gradient(90deg, #ffffff 0%, #7c5cff 100%)',
        'gradient-border': 'linear-gradient(135deg, #7c5cff, #3ab7ff)'
      }
    }
  },
  plugins: []
}
