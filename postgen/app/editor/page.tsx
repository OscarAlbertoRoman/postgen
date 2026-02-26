'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Download, Type, ImageIcon, AlignLeft, AlignCenter, AlignRight, Trash2 } from 'lucide-react'

function EditorCanvas() {
  const searchParams = useSearchParams()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<any>(null)
  const [ready, setReady] = useState(false)
  const [selectedObject, setSelectedObject] = useState<any>(null)

  // Form state for text layer controls
  const [fontSize, setFontSize] = useState(28)
  const [textColor, setTextColor] = useState('#f0e8d8')
  const [bgColor, setBgColor] = useState('#0f0e0d')
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal')
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal')
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left')

  const initialText = searchParams.get('text') || 'Tu post aquí...'
  const initialHashtags = searchParams.get('hashtags') || ''

  useEffect(() => {
    let fabricInstance: any = null

    async function initFabric() {
      // Dynamically import fabric to avoid SSR issues
      const { fabric } = await import('fabric')
      const canvas = canvasRef.current
      if (!canvas) return

      fabricInstance = new fabric.Canvas(canvas, {
        width: 1080,
        height: 1080,
        backgroundColor: '#0f0e0d',
        selection: true,
      })
      fabricRef.current = fabricInstance

      // Background rect
      const bg = new fabric.Rect({
        left: 0, top: 0,
        width: 1080, height: 1080,
        fill: '#0f0e0d',
        selectable: false,
        evented: false,
      })
      fabricInstance.add(bg)

      // Gold accent bar
      const bar = new fabric.Rect({
        left: 60, top: 900,
        width: 200, height: 3,
        fill: '#c9b89a',
        selectable: true,
      })
      fabricInstance.add(bar)

      // Main text
      const textbox = new fabric.Textbox(initialText, {
        left: 60, top: 80,
        width: 960,
        fontSize: 42,
        fill: '#f0e8d8',
        fontFamily: 'Georgia, serif',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: 1.4,
        splitByGrapheme: false,
      })
      fabricInstance.add(textbox)

      // Hashtags text
      if (initialHashtags) {
        const hashText = initialHashtags.split(',').map((h: string) => `#${h.trim()}`).join(' ')
        const hashbox = new fabric.Textbox(hashText, {
          left: 60, top: 930,
          width: 960,
          fontSize: 24,
          fill: '#665e52',
          fontFamily: 'monospace',
        })
        fabricInstance.add(hashbox)
      }

      // Selection events
      fabricInstance.on('selection:created', (e: any) => setSelectedObject(e.selected?.[0]))
      fabricInstance.on('selection:updated', (e: any) => setSelectedObject(e.selected?.[0]))
      fabricInstance.on('selection:cleared', () => setSelectedObject(null))

      fabricInstance.renderAll()
      setReady(true)
    }

    initFabric()

    return () => {
      fabricInstance?.dispose()
    }
  }, [])

  function addTextLayer() {
    if (!fabricRef.current) return
    const { fabric } = require('fabric')
    const t = new fabric.Textbox('Nuevo texto', {
      left: 100, top: 300,
      width: 880,
      fontSize: 32,
      fill: '#f0e8d8',
      fontFamily: 'Georgia, serif',
    })
    fabricRef.current.add(t)
    fabricRef.current.setActiveObject(t)
    setSelectedObject(t)
  }

  function deleteSelected() {
    if (!fabricRef.current || !selectedObject) return
    fabricRef.current.remove(selectedObject)
    setSelectedObject(null)
  }

  function applyFontSize(val: number) {
    if (!selectedObject || selectedObject.type !== 'textbox') return
    selectedObject.set('fontSize', val)
    fabricRef.current.renderAll()
    setFontSize(val)
  }

  function applyColor(color: string) {
    if (!selectedObject || selectedObject.type !== 'textbox') return
    selectedObject.set('fill', color)
    fabricRef.current.renderAll()
    setTextColor(color)
  }

  function applyAlign(a: 'left' | 'center' | 'right') {
    if (!selectedObject || selectedObject.type !== 'textbox') return
    selectedObject.set('textAlign', a)
    fabricRef.current.renderAll()
    setAlign(a)
  }

  function applyBold() {
    if (!selectedObject || selectedObject.type !== 'textbox') return
    const next = selectedObject.fontWeight === 'bold' ? 'normal' : 'bold'
    selectedObject.set('fontWeight', next)
    fabricRef.current.renderAll()
    setFontWeight(next)
  }

  function applyItalic() {
    if (!selectedObject || selectedObject.type !== 'textbox') return
    const next = selectedObject.fontStyle === 'italic' ? 'normal' : 'italic'
    selectedObject.set('fontStyle', next)
    fabricRef.current.renderAll()
    setFontStyle(next)
  }

  function changeBg(color: string) {
    if (!fabricRef.current) return
    fabricRef.current.backgroundColor = color
    fabricRef.current.renderAll()
    setBgColor(color)
  }

  function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !fabricRef.current) return
    const url = URL.createObjectURL(file)
    const { fabric } = require('fabric')
    fabric.Image.fromURL(url, (img: any) => {
      img.scaleToWidth(1080)
      img.set({ left: 0, top: 0, selectable: true })
      fabricRef.current.insertAt(img, 1) // Behind text layers
      fabricRef.current.renderAll()
    })
  }

  async function exportImage() {
    if (!fabricRef.current) return
    const dataURL = fabricRef.current.toDataURL({ format: 'png', multiplier: 1 })
    const a = document.createElement('a')
    a.download = 'post.png'
    a.href = dataURL
    a.click()
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#0a0907' }}>
      <div className="mb-8">
        <span className="label-mono block mb-2">Editor Visual</span>
        <h1 className="font-serif text-4xl" style={{ color: '#f0e8d8' }}>
          Diseñá tu <em>post</em>
        </h1>
        <p className="text-sm mt-1" style={{ color: '#665e52' }}>
          Hacé clic en cualquier elemento para editarlo. Arrastrá para reposicionar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
        {/* Canvas */}
        <div>
          {/* Toolbar */}
          <div
            className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-lg border"
            style={{ background: '#1a1814', border: '1px solid #2a2520' }}
          >
            <button onClick={addTextLayer} className="btn-ghost flex items-center gap-1.5 text-xs">
              <Type size={13} /> Añadir texto
            </button>

            <label className="btn-ghost flex items-center gap-1.5 text-xs cursor-pointer">
              <ImageIcon size={13} /> Imagen de fondo
              <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
            </label>

            {selectedObject && (
              <button onClick={deleteSelected} className="btn-ghost flex items-center gap-1.5 text-xs" style={{ color: '#a09282' }}>
                <Trash2 size={13} /> Eliminar
              </button>
            )}

            <div className="ml-auto flex items-center gap-2">
              <label className="label-mono text-[9px]" style={{ color: '#443c32' }}>Fondo</label>
              <input
                type="color"
                value={bgColor}
                onChange={e => changeBg(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0"
                style={{ background: 'none' }}
              />
              <button onClick={exportImage} className="btn-gold flex items-center gap-1.5 text-xs">
                <Download size={13} /> Exportar PNG
              </button>
            </div>
          </div>

          {/* Canvas wrapper - scaled down for display */}
          <div
            className="rounded-xl overflow-hidden border"
            style={{
              border: '1px solid #2a2520',
              transform: 'scale(0.45)',
              transformOrigin: 'top left',
              width: '1080px',
              height: '1080px',
              marginBottom: `-${1080 * 0.55}px`, // compensate for scale
            }}
          >
            <canvas ref={canvasRef} />
          </div>

          <div className="mt-2">
            <p className="label-mono text-[9px]" style={{ color: '#443c32' }}>
              Vista previa a escala — la exportación es 1080×1080px
            </p>
          </div>
        </div>

        {/* Controls panel */}
        <div className="card-dark space-y-5">
          <span className="label-mono block">Propiedades del elemento</span>

          {!selectedObject ? (
            <p className="text-xs" style={{ color: '#443c32' }}>
              Hacé clic en un elemento del canvas para editar sus propiedades.
            </p>
          ) : selectedObject.type === 'textbox' ? (
            <>
              {/* Font size */}
              <div>
                <label className="label-mono block mb-2">Tamaño ({fontSize}px)</label>
                <input
                  type="range" min={12} max={120} value={fontSize}
                  onChange={e => applyFontSize(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              {/* Text color */}
              <div>
                <label className="label-mono block mb-2">Color del texto</label>
                <div className="flex gap-2 flex-wrap">
                  {['#f0e8d8', '#c9b89a', '#ffffff', '#665e52', '#000000', '#ff6b6b'].map(c => (
                    <button
                      key={c}
                      onClick={() => applyColor(c)}
                      className="w-7 h-7 rounded-md border-2 transition-all"
                      style={{ background: c, borderColor: textColor === c ? '#c9b89a' : 'transparent' }}
                    />
                  ))}
                  <input
                    type="color" value={textColor}
                    onChange={e => applyColor(e.target.value)}
                    className="w-7 h-7 rounded-md cursor-pointer"
                  />
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="label-mono block mb-2">Estilo</label>
                <div className="flex gap-2">
                  <button
                    onClick={applyBold}
                    className="btn-ghost text-xs font-bold px-3 py-2"
                    style={{ color: fontWeight === 'bold' ? '#c9b89a' : undefined }}
                  >B</button>
                  <button
                    onClick={applyItalic}
                    className="btn-ghost text-xs italic px-3 py-2"
                    style={{ color: fontStyle === 'italic' ? '#c9b89a' : undefined }}
                  >I</button>
                </div>
              </div>

              {/* Align */}
              <div>
                <label className="label-mono block mb-2">Alineación</label>
                <div className="flex gap-2">
                  {(['left', 'center', 'right'] as const).map(a => {
                    const Icon = a === 'left' ? AlignLeft : a === 'center' ? AlignCenter : AlignRight
                    return (
                      <button
                        key={a}
                        onClick={() => applyAlign(a)}
                        className="btn-ghost px-3 py-2"
                        style={{ color: align === a ? '#c9b89a' : undefined }}
                      >
                        <Icon size={14} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs" style={{ color: '#665e52' }}>
              Elemento seleccionado. Podés moverlo o eliminarlo con el botón de la barra.
            </p>
          )}

          <div className="pt-4 border-t space-y-2" style={{ borderColor: '#2a2520' }}>
            <p className="label-mono">Tips</p>
            <p className="text-xs leading-relaxed" style={{ color: '#443c32' }}>
              • Doble clic en un texto para editar su contenido<br/>
              • Arrastrá las esquinas para redimensionar<br/>
              • Usá Ctrl+Z para deshacer<br/>
              • El PNG exportado es 1080×1080px (ideal para Instagram)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0907' }}>
        <p className="label-mono" style={{ color: '#443c32' }}>Cargando editor...</p>
      </div>
    }>
      <EditorCanvas />
    </Suspense>
  )
}
