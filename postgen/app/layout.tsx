import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'PostGen — Generador de Contenido IA',
  description: 'Creá posts brillantes para Instagram y LinkedIn con inteligencia artificial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="flex h-screen overflow-hidden" style={{ background: '#fef9f0' }}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto pt-12 pb-20 md:pt-0 md:pb-0">
          {children}
        </main>
      </body>
    </html>
  )
}
