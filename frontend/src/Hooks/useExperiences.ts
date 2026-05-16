import { useState, useEffect } from 'react'
import { getApiBaseUrl } from '@/config'
import { experience as staticExperiences } from '@/content/portfolio'
import type { ExpItem } from '@/content/portfolio'

/** Shape returned by `GET /api/experiences` */
export interface ApiExpItem {
  id: number
  sortOrder: number
  fromYear: string
  toYear: string | null
  roleEn: string | null
  roleZh: string | null
  orgEn: string | null
  orgZh: string | null
  location: string | null
  tags: string[] | string | null
  bulletsEn: string[] | string | null
  bulletsZh: string[] | string | null
  noteEn: string | null
  noteZh: string | null
}

export type { ExpItem }

/**
 * Converts a DB experience row into the same shape as portfolio.ts `ExpItem`
 * so the ExperienceSection component works without changes.
 */
function parseList(value: string[] | string | null | undefined, legacy?: string | null): string[] {
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean)
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed: unknown = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
      }
    } catch {
      return value.split('\n').map((item) => item.trim()).filter(Boolean)
    }
  }
  return legacy ? legacy.split('\n').map((item) => item.trim()).filter(Boolean) : []
}

export function apiToExpItem(item: ApiExpItem, fallback?: ExpItem): ExpItem {
  const to = item.toYear ?? 'Now'
  const stack = parseList(item.tags)
  return {
    period: `${item.fromYear} → ${to}`,
    company: {
      en: item.orgEn ?? '',
      zh: item.orgZh ?? '',
    },
    role: {
      en: item.roleEn ?? '',
      zh: item.roleZh ?? '',
    },
    location: item.location ?? fallback?.location ?? '',
    stack: stack.length > 0 ? stack : fallback?.stack ?? [],
    bullets: {
      en: parseList(item.bulletsEn, item.noteEn),
      zh: parseList(item.bulletsZh, item.noteZh),
    },
  }
}

/**
 * Hook: fetch experiences from API; fall back to portfolio.ts if empty or error.
 *
 * Usage:
 *   const { experiences, loading } = useExperiences()
 */
export function useExperiences() {
  const [experiences, setExperiences] = useState<ExpItem[]>(staticExperiences)
  const [loading, setLoading] = useState(true)
  const [apiItems, setApiItems] = useState<ApiExpItem[]>([])

  useEffect(() => {
    fetch(`${getApiBaseUrl()}/api/experiences`)
      .then(r => r.json())
      .then((d: { success?: boolean; data?: ApiExpItem[] }) => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          setApiItems(d.data)
          setExperiences(d.data.map((item, index) => apiToExpItem(item, staticExperiences[index])))
        }
        // If empty or no success, keep static fallback (set in initial state)
      })
      .catch(() => {
        // Network error — keep static fallback silently
      })
      .finally(() => setLoading(false))
  }, [])

  return { experiences, loading, apiItems }
}
