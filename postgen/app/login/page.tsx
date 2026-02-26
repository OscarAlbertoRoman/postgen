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
      style={{ background: '#fef9f0' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="label-mono block mb-3">Acceso privado</span>
          <h1 className="text-5xl mb-2 font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#2d1f0e' }}>
            Post<em style={{ color: '#e8732a' }}>Gen</em>
          </h1>
          <span className="label-mono text-[10px]">✦ con IA</span>
        </div>

        <div className="card-dark">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={14} style={{ color: '#b8956a' }} />
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
            <p className="text-xs mb-4 text-center" style={{ color: '#e8732a' }}>
              Contraseña incorrecta. Intentá de nuevo.
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !password}
            className="w-full btn-gold flex items-center justify-center gap-2 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 size={15} className="animate-spin" /> Verificando...</> : 'Ingresar 🌿'}
          </button>
        </div>
      </div>
    </div>
  )
}
