/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'bebas': ['var(--font-bebas)', 'Bebas Neue', 'cursive'],
        'orbitron': ['var(--font-orbitron)', 'Orbitron', 'monospace'],
      },
      colors: {
        'jjk': {
          purple: '#8b5cf6',
          yellow: '#fbbf24',
          red: '#ef4444',
          blue: '#3b82f6',
          green: '#10b981',
        },
        'glass': {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.7)',
        }
      },
      animation: {
        'energy-float': 'energyFloat 6s ease-in-out infinite',
        'energy-glow': 'energyGlow 1.5s ease-in-out infinite alternate',
        'cursed-shake': 'cursedShake 0.4s ease-in-out',
        'glow-pulse': 'glowPulse 2.5s infinite ease-in-out',
        'pulse-glow': 'pulse-glow 1s infinite',
        'glow-dark': 'glowDark 1s ease-in-out',
        'particle-float': 'particleFloat 8s ease-in-out infinite',
        'text-shine': 'textShine 3s ease-in-out infinite',
        'particles-move': 'particlesMove 20s ease-in-out infinite',
        'border-slide': 'borderSlide 2s infinite',
        'loading-dots': 'loadingDots 1.5s infinite',
      },
      keyframes: {
        energyFloat: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.85' },
          '50%': { transform: 'translateY(-25px) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '0.85' },
        },
        energyGlow: {
          'from': {
            filter: 'blur(10px) drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))',
          },
          'to': {
            filter: 'blur(14px) drop-shadow(0 0 16px rgba(168, 85, 247, 1))',
          },
        },
        cursedShake: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '20%': { transform: 'translate(-1px, 1px) rotate(-1deg)' },
          '40%': { transform: 'translate(1px, -1px) rotate(1deg)' },
          '60%': { transform: 'translate(-1px, 1px) rotate(0deg)' },
          '80%': { transform: 'translate(1px, -1px) rotate(1deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 0px rgba(128, 0, 255, 0.5)' },
          '50%': { boxShadow: '0 0 25px 10px rgba(128, 0, 255, 0.7)' },
          '100%': { boxShadow: '0 0 0px rgba(128, 0, 255, 0.5)' },
        },
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
        },
        glowDark: {
          '0%': { boxShadow: '0 0 0px rgba(128, 0, 128, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(128, 0, 255, 0.9)' },
          '100%': { boxShadow: '0 0 0px rgba(128, 0, 128, 0.4)' },
        },
        particleFloat: {
          '0%, 100%': { 
            transform: 'translateY(0) translateX(0) scale(1)', 
            opacity: '0.3' 
          },
          '25%': { 
            transform: 'translateY(-20px) translateX(10px) scale(1.2)', 
            opacity: '1' 
          },
          '50%': { 
            transform: 'translateY(-40px) translateX(-5px) scale(0.8)', 
            opacity: '0.7' 
          },
          '75%': { 
            transform: 'translateY(-20px) translateX(-15px) scale(1.1)', 
            opacity: '0.9' 
          },
        },
        textShine: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        particlesMove: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(-10px, -10px) scale(1.1)' },
          '50%': { transform: 'translate(10px, -5px) scale(0.9)' },
          '75%': { transform: 'translate(-5px, 10px) scale(1.05)' },
        },
        borderSlide: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        loadingDots: {
          '0%, 20%': { content: '""' },
          '40%': { content: '"."' },
          '60%': { content: '".."' },
          '80%, 100%': { content: '"..."' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'jjk': '0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05)',
        'jjk-lg': '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-purple': {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-shine': {
          background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #d97706, #fbbf24)',
          'background-size': '200% 100%',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          animation: 'textShine 3s ease-in-out infinite',
        },
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.7)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        },
        '.hover-lift': {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.hover-lift:hover': {
          transform: 'translateY(-4px)',
          'box-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        '.btn-jjk': {
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        },
        '.btn-jjk::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          transition: 'left 0.5s',
        },
        '.btn-jjk:hover::before': {
          left: '100%',
        },
        '.border-animated': {
          position: 'relative',
          overflow: 'hidden',
        },
        '.border-animated::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '-100%',
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.8), transparent)',
          animation: 'borderSlide 2s infinite',
        },
        '.particles-bg': {
          position: 'relative',
          overflow: 'hidden',
        },
        '.particles-bg::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          'background-image': `
            radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)
          `,
          animation: 'particlesMove 20s ease-in-out infinite',
        },
        '.energy-particle': {
          position: 'absolute',
          width: '4px',
          height: '4px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 1) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 100%)',
          'border-radius': '50%',
          animation: 'particleFloat 8s ease-in-out infinite',
          'pointer-events': 'none',
        },
        '.loading-dots': {
          display: 'inline-block',
        },
        '.loading-dots::after': {
          content: '""',
          animation: 'loadingDots 1.5s infinite',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} 