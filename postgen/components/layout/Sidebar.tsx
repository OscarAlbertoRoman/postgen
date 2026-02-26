'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Clock, Calendar, ImageIcon } from 'lucide-react'

const nav = [
  { href: '/',          icon: Sparkles,  label: 'Generar'    },
  { href: '/history',   icon: Clock,     label: 'Historial'  },
  { href: '/calendar',  icon: Calendar,  label: 'Calendario' },
  { href: '/editor',    icon: ImageIcon, label: 'Editor'     },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className="hidden md:flex w-56 flex-col border-r shrink-0"
        style={{ background: '#fffdf7', borderColor: '#e8d9c4' }}
      >
        <div className="px-6 py-6 border-b" style={{ borderColor: '#e8d9c4' }}>
          <span className="label-mono block mb-2">Herramienta</span>
          <h1 className="font-['Fraunces'] text-2xl font-bold" style={{ color: '#2d1f0e' }}>
            Post<em>Gen</em>
          </h1>
          <span className="label-mono text-[9px]" style={{ color: '#b8956a' }}>✦ con IA</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  color: active ? '#e8732a' : '#7a5c3a',
                  background: active ? 'rgba(232,115,42,0.1)' : 'transparent',
                  borderLeft: active ? '3px solid #e8732a' : '3px solid transparent',
                }}
              >
                <Icon size={16} />{label}
              </Link>
            )
          })}
        </nav>

        <div className="px-6 py-4 border-t" style={{ borderColor: '#e8d9c4' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ background: '#f5c842', color: '#2d1f0e' }}>🌿</div>
            <p className="label-mono text-[9px]" style={{ color: '#b8956a' }}>PostGen v0.1 — Beta</p>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b"
        style={{ background: '#fffdf7', borderColor: '#e8d9c4' }}
      >
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#2d1f0e' }}>
          Post<em>Gen</em>
        </h1>
        <span className="label-mono text-[9px]" style={{ color: '#b8956a' }}>✦ con IA</span>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t"
        style={{ background: '#fffdf7', borderColor: '#e8d9c4' }}
      >
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-all"
              style={{ color: active ? '#e8732a' : '#b8956a' }}
            >
              <Icon size={18} />{label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
