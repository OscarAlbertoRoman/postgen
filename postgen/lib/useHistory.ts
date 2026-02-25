'use client'

import { useState, useEffect, useCallback } from 'react'

export interface GeneratedPost {
  id: string
  topic: string
  tone: string
  networks: string[]
  results: Record<string, {
    text: string
    hashtags: string[]
    charCount: number
  }>
  createdAt: string
  scheduledFor?: string // ISO date string for calendar
}

const STORAGE_KEY = 'postgen_history'

export function useHistory() {
  const [posts, setPosts] = useState<GeneratedPost[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setPosts(JSON.parse(stored))
    } catch {}
  }, [])

  const save = useCallback((data: Omit<GeneratedPost, 'id' | 'createdAt'>) => {
    const post: GeneratedPost = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setPosts(prev => {
      const next = [post, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
    return post
  }, [])

  const remove = useCallback((id: string) => {
    setPosts(prev => {
      const next = prev.filter(p => p.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const schedule = useCallback((id: string, date: string) => {
    setPosts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, scheduledFor: date } : p)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const update = useCallback((id: string, network: string, text: string) => {
    setPosts(prev => {
      const next = prev.map(p => {
        if (p.id !== id) return p
        return {
          ...p,
          results: {
            ...p.results,
            [network]: { ...p.results[network], text, charCount: text.length },
          },
        }
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { posts, save, remove, schedule, update }
}
