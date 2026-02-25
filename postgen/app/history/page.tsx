'use client'

import { useState } from 'react'
import { useHistory, GeneratedPost } from '@/lib/useHistory'
import { Trash2, Copy, Check, ImageIcon, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const NETWORK_EMOJI: Record<string, string> = {
  instagram: '📸',
  linkedin: '💼',
  twitter: '🐦',
}

export default function HistoryPage() {
  const { posts, remove } = useHistory()
  const [copied, setCopied] = useState<string | null>(null)
  const [activePost, setActivePost] = useState<string | null>(null)
  const [activeNetwork, setActiveNetwork] = useState<string>('')
  const router = useRouter()

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  function goToEditor(post: GeneratedPost, network: string) {
    const result = post.results[network]
    if (!result) return
    const params = new URLSearchParams({
      text: result.text,
      hashtags: result.hashtags.join(','),
      network,
    })
    router.push(`/editor?${params.toString()}`)
  }

  function selectPost(id: string, firstNetwork: string) {
    setActivePost(id)
    setActiveNetwork(firstNetwork)
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center" style={{ background: '#0a0907' }}>
        <span className="label-mono block mb-3" style={{ color: '#443c32' }}>Historial</span>
        <h2 className="font-serif text-3xl mb-2" style={{ color: '#f0e8d8' }}>Sin posts todavía</h2>
        <p className="text-sm" style={{ color: '#665e52' }}>Los posts que generes aparecerán aquí automáticamente.</p>
      </div>
    )
  }

  const selected = posts.find(p => p.id === activePost)

  return (
    <div className="min-h-screen p-8" style={{ background: '#0a0907' }}>
      <div className="mb-8">
        <span className="label-mono block mb-2">Archivo</span>
        <h1 className="font-serif text-4xl" style={{ color: '#f0e8d8' }}>
          Tu <em>Historial</em>
        </h1>
        <p className="text-sm mt-1" style={{ color: '#665e52' }}>
          {posts.length} {posts.length === 1 ? 'post generado' : 'posts generados'}
        </p>
      </div>

      <div className="grid grid-cols-[300px_1fr] gap-6 items-start">
        {/* List */}
        <div className="space-y-2">
          {posts.map(post => (
            <button
              key={post.id}
              onClick={() => selectPost(post.id, post.networks[0])}
              className="w-full text-left px-4 py-3 rounded-xl border transition-all duration-150"
              style={{
                background: activePost === post.id ? '#1a1814' : 'transparent',
                border: `1px solid ${activePost === post.id ? '#443c32' : '#2a2520'}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium truncate" style={{ color: '#f0e8d8' }}>
                  {post.topic}
                </p>
                <span className="label-mono text-[9px] shrink-0 mt-0.5" style={{ color: '#443c32' }}>
                  {format(new Date(post.createdAt), 'dd MMM', { locale: es })}
                </span>
              </div>
              <div className="flex gap-1 mt-1.5">
                {post.networks.map(n => (
                  <span key={n} className="text-xs">{NETWORK_EMOJI[n]}</span>
                ))}
                <span className="label-mono text-[9px] ml-1" style={{ color: '#665e52' }}>{post.tone}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="card-dark">
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="label-mono block mb-1">Post</span>
                <h2 className="font-serif text-2xl" style={{ color: '#f0e8d8' }}>{selected.topic}</h2>
                <p className="text-xs mt-1" style={{ color: '#665e52' }}>
                  {format(new Date(selected.createdAt), "dd 'de' MMMM 'a las' HH:mm", { locale: es })}
                  {' · '}Tono: {selected.tone}
                </p>
              </div>
              <button
                onClick={() => remove(selected.id)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#443c32' }}
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Network tabs */}
            <div className="flex gap-0 mb-5 rounded-lg overflow-hidden border" style={{ border: '1px solid #2a2520' }}>
              {selected.networks.map(nid => (
                <button
                  key={nid}
                  onClick={() => setActiveNetwork(nid)}
                  className="flex-1 py-2 text-xs font-medium transition-all"
                  style={{
                    background: activeNetwork === nid ? '#2a2520' : '#1a1814',
                    color: activeNetwork === nid ? '#c9b89a' : '#443c32',
                    borderRight: '1px solid #2a2520',
                  }}
                >
                  {NETWORK_EMOJI[nid]} {nid.charAt(0).toUpperCase() + nid.slice(1)}
                </button>
              ))}
            </div>

            {activeNetwork && selected.results[activeNetwork] && (
              <>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#a09282' }}>
                  {selected.results[activeNetwork].text}
                </p>
                {selected.results[activeNetwork].hashtags.length > 0 && (
                  <p className="text-sm mb-5" style={{ color: '#665e52', lineHeight: 1.8 }}>
                    {selected.results[activeNetwork].hashtags.map(h => `#${h}`).join(' ')}
                  </p>
                )}

                <div className="flex gap-2 pt-4 border-t" style={{ borderColor: '#2a2520' }}>
                  <button
                    onClick={() => goToEditor(selected, activeNetwork)}
                    className="btn-ghost flex items-center gap-1.5 text-xs"
                  >
                    <ImageIcon size={13} /> Editor visual
                  </button>
                  <button
                    onClick={() => copy(selected.results[activeNetwork].text, selected.id + activeNetwork)}
                    className="btn-gold flex items-center gap-1.5 text-xs ml-auto"
                  >
                    {copied === selected.id + activeNetwork
                      ? <><Check size={13} /> Copiado</>
                      : <><Copy size={13} /> Copiar</>
                    }
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div
            className="h-48 flex items-center justify-center rounded-xl border"
            style={{ border: '1px dashed #2a2520' }}
          >
            <p className="label-mono" style={{ color: '#443c32' }}>Seleccioná un post para ver el detalle</p>
          </div>
        )}
      </div>
    </div>
  )
}
