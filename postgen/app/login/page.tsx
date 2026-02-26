'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!password) return
    setLoading(true)
    setError(false)

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0a0907' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="label-mono block mb-3" style={{ color: '#443c32' }}>Acceso privado</span>
          <h1 className="font-serif text-5xl mb-2" style={{ color: '#f0e8d8' }}>
            Post<em>Gen</em>
          </h1>
          <span className="label-mono text-[10px]" style={{ color: '#443c32' }}>✦ con IA</span>
        </div>

        {/* Card */}
        <div className="card-dark">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={14} style={{ color: '#665e52' }} />
            <span className="label-mono">Contraseña</span>
          </div>

          <input
            className="input-gold mb-4"
            type="password"
            placeholder="Ingresá tu contraseña..."
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoFocus
          />

          {error && (
            <p className="text-xs mb-4 text-center" style={{ color: '#c9b89a', opacity: 0.7 }}>
              Contraseña incorrecta. Intentá de nuevo.
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !password}
            className="w-full btn-gold flex items-center justify-center gap-2 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 size={15} className="animate-spin" /> Verificando...</> : 'Ingresar'}
          </button>
        </div>
      </div>
    </div>
  )
}
