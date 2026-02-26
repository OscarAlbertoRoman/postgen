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
        style={{ background: '#0f0e0d', borderColor: '#2a2520' }}
      >
        <div className="px-6 py-6 border-b" style={{ borderColor: '#2a2520' }}>
          <span className="label-mono block mb-1">Herramienta</span>
          <h1 className="font-serif text-2xl" style={{ color: '#f0e8d8' }}>
            Post<em>Gen</em>
          </h1>
          <span className="label-mono text-[9px]" style={{ color: '#443c32' }}>✦ con IA</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: active ? '#c9b89a' : '#665e52', background: active ? '#2a2520' : 'transparent' }}
              >
                <Icon size={16} />{label}
              </Link>
            )
          })}
        </nav>
        <div className="px-6 py-4 border-t" style={{ borderColor: '#2a2520' }}>
          <p className="label-mono text-[9px]" style={{ color: '#443c32' }}>PostGen v0.1 — Beta</p>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b"
        style={{ background: '#0f0e0d', borderColor: '#2a2520' }}
      >
        <h1 className="font-serif text-xl" style={{ color: '#f0e8d8' }}>Post<em>Gen</em></h1>
        <span className="label-mono text-[9px]" style={{ color: '#443c32' }}>✦ con IA</span>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t"
        style={{ background: '#0f0e0d', borderColor: '#2a2520' }}
      >
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-all"
              style={{ color: active ? '#c9b89a' : '#443c32' }}
            >
              <Icon size={18} />{label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
