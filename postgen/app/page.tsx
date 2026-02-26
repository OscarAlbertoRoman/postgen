'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Copy, Check, RotateCcw, Download, Calendar } from 'lucide-react'
import { useHistory } from '@/lib/useHistory'
import { useRouter } from 'next/navigation'

const TONES = ['Profesional', 'Cercano', 'Inspirador', 'Educativo', 'Directo', 'Gracioso']
const NETWORKS = [
  { id: 'instagram', label: 'Instagram', emoji: '📸' },
  { id: 'linkedin',  label: 'LinkedIn',  emoji: '💼' },
  { id: 'twitter',   label: 'X / Twitter', emoji: '🐦' },
]

interface PostResult {
  text: string
  hashtags: string[]
  charCount: number
}

export default function GeneratorPage() {
  const router = useRouter()
  const { save } = useHistory()

  const [topic, setTopic]           = useState('')
  const [context, setContext]       = useState('')
  const [tone, setTone]             = useState('Profesional')
  const [networks, setNetworks]     = useState<string[]>(['instagram', 'linkedin'])
  const [hashtags, setHashtags]     = useState(true)
  const [cta, setCta]               = useState(false)
  const [loading, setLoading]       = useState(false)
  const [results, setResults]       = useState<Record<string, PostResult> | null>(null)
  const [activeTab, setActiveTab]   = useState<string>('')
  const [copied, setCopied]         = useState<string | null>(null)
  const [editedTexts, setEditedTexts] = useState<Record<string, string>>({})
  const [error, setError]           = useState<string | null>(null)

  function toggleNetwork(id: string) {
    setNetworks(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    )
  }

  async function generate() {
    if (!topic.trim() || networks.length === 0) return
    setLoading(true)
    setError(null)
    setResults(null)
    setEditedTexts({})

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, context, tone, networks, includeHashtags: hashtags, includeCTA: cta }),
      })

      if (!res.ok) throw new Error('Error en la API')
      const data = await res.json()
      setResults(data.results)
      setActiveTab(networks[0])

      // Auto-save to history
      save({ topic, tone, networks, results: data.results })
    } catch (e) {
      setError('Hubo un error generando el contenido. Revisá tu API key en .env.local')
    } finally {
      setLoading(false)
    }
  }

  async function copyText(network: string) {
    const text = getDisplayText(network)
    const post = results?.[network]
    const full = post?.hashtags.length
      ? `${text}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`
      : text
    await navigator.clipboard.writeText(full)
    setCopied(network)
    setTimeout(() => setCopied(null), 2000)
  }

  function getDisplayText(network: string) {
    return editedTexts[network] ?? results?.[network]?.text ?? ''
  }

  function goToEditor(network: string) {
    const post = results?.[network]
    if (!post) return
    const params = new URLSearchParams({
      text: getDisplayText(network),
      hashtags: post.hashtags.join(','),
      network,
    })
    router.push(`/editor?${params.toString()}`)
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#fef9f0' }}>
      {/* Header */}
      <div className="mb-10">
        <span className="label-mono block mb-2">Nueva Pieza</span>
        <h1 className="text-4xl mb-2 font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#2d1f0e' }}>
          Creá contenido <em style={{ color: '#e8732a' }}>brillante</em>
        </h1>
        <p className="text-sm" style={{ color: '#7a5c3a' }}>
          Ingresá tu tema y la IA generará posts optimizados para cada red.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
        {/* LEFT PANEL — Form */}
        <div className="card-dark space-y-6">
          {/* Topic */}
          <div>
            <label className="label-mono block mb-2">Tema principal *</label>
            <input
              className="input-gold"
              type="text"
              placeholder="ej: marketing de contenidos en 2025"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
            />
          </div>

          {/* Context */}
          <div>
            <label className="label-mono block mb-2">Contexto (opcional)</label>
            <textarea
              className="input-gold resize-none h-24"
              placeholder="Audiencia objetivo, datos relevantes, ángulo específico..."
              value={context}
              onChange={e => setContext(e.target.value)}
            />
          </div>

          {/* Tone */}
          <div>
            <label className="label-mono block mb-3">Tono de voz</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                  style={{
                    background: tone === t ? '#e8732a' : '#fef9f0',
                    color: tone === t ? '#fff' : '#7a5c3a',
                    border: `1.5px solid ${tone === t ? '#e8732a' : '#e8d9c4'}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Networks */}
          <div>
            <label className="label-mono block mb-3">Redes sociales</label>
            <div className="space-y-2">
              {NETWORKS.map(n => (
                <button
                  key={n.id}
                  onClick={() => toggleNetwork(n.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={{
                    background: networks.includes(n.id) ? 'rgba(232,115,42,0.08)' : 'transparent',
                    border: `1.5px solid ${networks.includes(n.id) ? '#e8732a' : '#e8d9c4'}`,
                    color: networks.includes(n.id) ? '#e8732a' : '#7a5c3a',
                  }}
                >
                  <span>{n.emoji}</span>
                  {n.label}
                  {networks.includes(n.id) && (
                    <span className="ml-auto" style={{ color: '#e8732a' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#e8d9c4' }}>
            {[
              { key: 'hashtags', label: 'Incluir hashtags', value: hashtags, set: setHashtags },
              { key: 'cta',      label: 'Llamado a la acción', value: cta, set: setCta },
            ].map(({ key, label, value, set }) => (
              <div key={key} className="flex items-center justify-between py-1">
                <span className="text-xs font-medium" style={{ color: '#7a5c3a' }}>{label}</span>
                <button
                  onClick={() => set(!value)}
                  className="w-10 h-5 rounded-full relative transition-colors duration-200"
                  style={{ background: value ? '#e8732a' : '#e8d9c4' }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                    style={{ left: value ? '22px' : '2px' }}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading || !topic.trim() || networks.length === 0}
            className="w-full btn-gold flex items-center justify-center gap-2 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Generando...</>
              : <><Sparkles size={16} /> Generar posts</>
            }
          </button>

          {error && (
            <p className="text-xs text-center" style={{ color: '#e8732a', opacity: 0.8 }}>{error}</p>
          )}
        </div>

        {/* RIGHT PANEL — Results */}
        <div>
          {!results && !loading && (
            <div
              className="h-64 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed"
              style={{ borderColor: '#e8d9c4', background: '#fffdf7' }}
            >
              <Sparkles size={32} style={{ color: '#f5c842' }} className="mb-3" />
              <p className="label-mono" style={{ color: '#b8956a' }}>
                Los posts generados aparecerán aquí
              </p>
            </div>
          )}

          {loading && (
            <div
              className="h-64 flex flex-col items-center justify-center rounded-2xl border"
              style={{ border: '1.5px solid #e8d9c4', background: '#fffdf7' }}
            >
              <Loader2 size={32} style={{ color: '#e8732a' }} className="animate-spin mb-3" />
              <p className="label-mono" style={{ color: '#b8956a' }}>
                Generando contenido...
              </p>
            </div>
          )}

          {results && (
            <div>
              {/* Tabs */}
              <div className="flex gap-0 mb-6 rounded-xl overflow-hidden border" style={{ border: '1.5px solid #e8d9c4' }}>
                {networks.map(nid => {
                  const net = NETWORKS.find(n => n.id === nid)
                  return (
                    <button
                      key={nid}
                      onClick={() => setActiveTab(nid)}
                      className="flex-1 py-2.5 text-xs font-semibold transition-all duration-150"
                      style={{
                        background: activeTab === nid ? '#e8732a' : '#fffdf7',
                        color: activeTab === nid ? '#fff' : '#7a5c3a',
                        borderRight: '1.5px solid #e8d9c4',
                      }}
                    >
                      {net?.emoji} {net?.label}
                    </button>
                  )
                })}
              </div>

              {/* Active post */}
              {activeTab && results[activeTab] && (
                <div className="card-dark">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1">
                      <span className="label-mono">
                        {NETWORKS.find(n => n.id === activeTab)?.emoji}{' '}
                        {NETWORKS.find(n => n.id === activeTab)?.label}
                      </span>
                    </div>
                    <span className="label-mono text-[9px]" style={{ color: '#b8956a' }}>
                      {getDisplayText(activeTab).length} chars
                    </span>
                  </div>

                  <textarea
                    className="input-gold resize-none mb-4"
                    style={{ minHeight: '180px' }}
                    value={getDisplayText(activeTab)}
                    onChange={e => setEditedTexts(prev => ({ ...prev, [activeTab]: e.target.value }))}
                  />

                  {results[activeTab].hashtags.length > 0 && (
                    <p className="text-sm mb-5 font-medium" style={{ color: '#e8732a', lineHeight: 1.8 }}>
                      {results[activeTab].hashtags.map(h => `#${h}`).join(' ')}
                    </p>
                  )}

                  <div className="flex gap-2 pt-4 border-t" style={{ borderColor: '#e8d9c4' }}>
                    <button onClick={generate} className="btn-ghost flex items-center gap-1.5 text-xs">
                      <RotateCcw size={13} /> Regenerar
                    </button>
                    <button onClick={() => goToEditor(activeTab)} className="btn-ghost flex items-center gap-1.5 text-xs">
                      <Download size={13} /> Editor visual
                    </button>
                    <button onClick={() => copyText(activeTab)} className="btn-gold flex items-center gap-1.5 text-xs ml-auto">
                      {copied === activeTab
                        ? <><Check size={13} /> Copiado!</>
                        : <><Copy size={13} /> Copiar</>
                      }
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
