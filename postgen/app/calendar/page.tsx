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
    <div className="min-h-screen p-8" style={{ background: '#0a0907' }}>
      <div className="mb-8">
        <span className="label-mono block mb-2">Planificación</span>
        <h1 className="font-serif text-4xl" style={{ color: '#f0e8d8' }}>
          Tu <em>Calendario</em>
        </h1>
        <p className="text-sm mt-1" style={{ color: '#665e52' }}>
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
            <h2 className="font-serif text-xl" style={{ color: '#f0e8d8' }}>
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
                <span className="label-mono text-[9px]" style={{ color: '#443c32' }}>{d}</span>
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for first day offset */}
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
                  className="min-h-16 p-1.5 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: isSelected ? '#2a2520' : isToday ? '#1a1814' : 'transparent',
                    border: `1px solid ${isToday ? '#443c32' : isSelected ? '#665e52' : '#2a2520'}`,
                  }}
                >
                  <span
                    className="text-xs font-medium block mb-1"
                    style={{ color: isToday ? '#c9b89a' : '#665e52' }}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayPosts.slice(0, 2).map(p => (
                    <div
                      key={p.id}
                      className="text-[9px] rounded px-1 py-0.5 mb-0.5 truncate flex items-center gap-1"
                      style={{ background: '#2a2520', color: '#c9b89a' }}
                    >
                      {p.networks.map(n => NETWORK_EMOJI[n]).join('')} {p.topic}
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <span className="text-[9px]" style={{ color: '#443c32' }}>+{dayPosts.length - 2} más</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Selected day detail */}
          {selectedDay && postsForDay(selectedDay).length > 0 && (
            <div className="mt-6 pt-6 border-t" style={{ borderColor: '#2a2520' }}>
              <span className="label-mono block mb-3">
                {format(selectedDay, "d 'de' MMMM", { locale: es })}
              </span>
              <div className="space-y-2">
                {postsForDay(selectedDay).map(p => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    style={{ background: '#2a2520' }}
                  >
                    <span>{p.networks.map(n => NETWORK_EMOJI[n]).join(' ')}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#f0e8d8' }}>{p.topic}</p>
                      <p className="text-xs" style={{ color: '#665e52' }}>{p.tone}</p>
                    </div>
                    <button
                      onClick={() => schedule(p.id, '')}
                      className="p-1 rounded transition-colors"
                      style={{ color: '#443c32' }}
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
            <p className="text-xs" style={{ color: '#443c32' }}>Todos los posts están programados 🎉</p>
          ) : (
            <div className="space-y-2">
              {unscheduled.map(p => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => setDragging(p.id)}
                  onDragEnd={() => setDragging(null)}
                  className="px-3 py-2.5 rounded-lg border cursor-grab active:cursor-grabbing transition-all"
                  style={{
                    background: dragging === p.id ? '#2a2520' : '#1a1814',
                    border: '1px solid #2a2520',
                    opacity: dragging === p.id ? 0.5 : 1,
                  }}
                >
                  <p className="text-xs font-medium truncate mb-1" style={{ color: '#f0e8d8' }}>{p.topic}</p>
                  <div className="flex items-center gap-1">
                    {p.networks.map(n => <span key={n} className="text-xs">{NETWORK_EMOJI[n]}</span>)}
                    <span className="label-mono text-[9px] ml-1" style={{ color: '#665e52' }}>{p.tone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs mt-4" style={{ color: '#443c32' }}>
            ↑ Arrastrá hacia un día del calendario
          </p>
        </div>
      </div>
    </div>
  )
}
