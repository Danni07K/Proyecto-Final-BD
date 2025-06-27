import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import AudioSystem3D from '@/components/AudioSystem3D'
import AchievementSystem from '@/components/AchievementSystem'
import PWAInstaller from '@/components/PWAInstaller'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ClassCraft - Jujutsu Kaisen RPG 3D',
  description: 'Una aplicación educativa gamificada inspirada en Jujutsu Kaisen con personajes 3D interactivos y una tienda de accesorios avanzada.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ClassCraft'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
}

export const themeColor = '#7c3aed'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ClassCraft" />
        <link rel="apple-touch-icon" href="/classcraft-logo.png" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <meta name="msapplication-tileImage" content="/classcraft-logo.png" />
      </head>
      <body className={inter.className}>
        {children}
        
        {/* Sistemas globales */}
        <AudioSystem3D />
        <AchievementSystem />
        <PWAInstaller />
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #7c3aed',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
