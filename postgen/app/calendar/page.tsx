'use client'

import { useState } from 'react'
import { useHistory } from '@/lib/useHistory'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const NETWORK_EMOJI: Record<string, string> = {
  instagram: '📸',
  linkedin: '💼',
  twitter: '🐦',
}

export default function CalendarPage() {
  const { posts, schedule, remove } = useHistory()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  // Posts scheduled for a day
  function postsForDay(day: Date) {
    return posts.filter(p => p.scheduledFor && isSameDay(new Date(p.scheduledFor), day))
  }

  // Unscheduled posts (sidebar)
  const unscheduled = posts.filter(p => !p.scheduledFor)

  function handleDrop(day: Date) {
    if (!dragging) return
    schedule(dragging, day.toISOString())
    setDragging(null)
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#fef9f0' }}>
      <div className="mb-8">
        <span className="label-mono block mb-2">Planificación</span>
        <h1 className="text-4xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif', color: '#2d1f0e' }}>
          Tu <em style={{ color: '#e8732a' }}>Calendario</em>
        </h1>
        <p className="text-sm mt-1" style={{ color: '#7a5c3a' }}>
          Arrastrá los posts desde el panel derecho hacia un día del calendario.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-start">
        {/* Calendar */}
        <div className="card-dark">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="btn-ghost p-2">
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-xl font-bold capitalize" style={{ fontFamily: 'Fraunces, serif', color: '#2d1f0e' }}>
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h2>
            <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="btn-ghost p-2">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
              <div key={d} className="text-center py-2">
                <span className="label-mono text-[9px]">{d}</span>
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: (days[0].getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map(day => {
              const dayPosts = postsForDay(day)
              const isToday = isSameDay(day, new Date())
              const isSelected = selectedDay && isSameDay(day, selectedDay)

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(day)}
                  className="min-h-16 p-1.5 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: isSelected ? 'rgba(232,115,42,0.1)' : isToday ? '#fff8f0' : 'transparent',
                    border: `1.5px solid ${isToday ? '#f5c842' : isSelected ? '#e8732a' : '#e8d9c4'}`,
                  }}
                >
                  <span
                    className="text-xs font-semibold block mb-1"
                    style={{ color: isToday ? '#e8732a' : '#7a5c3a' }}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayPosts.slice(0, 2).map(p => (
                    <div
                      key={p.id}
                      className="text-[9px] rounded-md px-1 py-0.5 mb-0.5 truncate"
                      style={{ background: 'rgba(232,115,42,0.12)', color: '#e8732a' }}
                    >
                      {p.networks.map(n => NETWORK_EMOJI[n]).join('')} {p.topic}
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <span className="text-[9px]" style={{ color: '#b8956a' }}>+{dayPosts.length - 2} más</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Selected day detail */}
          {selectedDay && postsForDay(selectedDay).length > 0 && (
            <div className="mt-6 pt-6 border-t" style={{ borderColor: '#e8d9c4' }}>
              <span className="label-mono block mb-3">
                {format(selectedDay, "d 'de' MMMM", { locale: es })}
              </span>
              <div className="space-y-2">
                {postsForDay(selectedDay).map(p => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: 'rgba(232,115,42,0.08)', border: '1.5px solid #e8d9c4' }}
                  >
                    <span>{p.networks.map(n => NETWORK_EMOJI[n]).join(' ')}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#2d1f0e' }}>{p.topic}</p>
                      <p className="text-xs" style={{ color: '#b8956a' }}>{p.tone}</p>
                    </div>
                    <button
                      onClick={() => schedule(p.id, '')}
                      className="p-1 rounded-lg transition-colors hover:bg-red-50"
                      style={{ color: '#b8956a' }}
                      title="Quitar del calendario"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Unscheduled sidebar */}
        <div>
          <span className="label-mono block mb-4">Sin programar ({unscheduled.length})</span>
          {unscheduled.length === 0 ? (
            <p className="text-xs" style={{ color: '#b8956a' }}>Todos los posts están programados 🎉</p>
          ) : (
            <div className="space-y-2">
              {unscheduled.map(p => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => setDragging(p.id)}
                  onDragEnd={() => setDragging(null)}
                  className="px-3 py-2.5 rounded-xl border cursor-grab active:cursor-grabbing transition-all"
                  style={{
                    background: dragging === p.id ? 'rgba(232,115,42,0.1)' : '#fffdf7',
                    border: `1.5px solid ${dragging === p.id ? '#e8732a' : '#e8d9c4'}`,
                    opacity: dragging === p.id ? 0.6 : 1,
                    boxShadow: dragging === p.id ? '0 4px 12px rgba(232,115,42,0.2)' : 'none',
                  }}
                >
                  <p className="text-xs font-semibold truncate mb-1" style={{ color: '#2d1f0e' }}>{p.topic}</p>
                  <div className="flex items-center gap-1">
                    {p.networks.map(n => <span key={n} className="text-xs">{NETWORK_EMOJI[n]}</span>)}
                    <span className="label-mono text-[9px] ml-1" style={{ color: '#b8956a' }}>{p.tone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs mt-4" style={{ color: '#b8956a' }}>
            ↑ Arrastrá hacia un día del calendario
          </p>
        </div>
      </div>
    </div>
  )
}
