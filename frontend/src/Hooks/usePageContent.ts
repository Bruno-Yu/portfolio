import { useState, useEffect } from 'react'
import { getApiBaseUrl } from '@/config'

type Lang = 'en' | 'zh'

/**
 * Module-level cache — survives React re-renders within a session.
 * Key format: "<block_key>.<lang>" e.g. "hero.greeting.en"
 * Value: the text content from the API.
 *
 * null   = fetch not yet attempted
 * false  = fetch attempted but failed / returned empty
 * Map    = fetch succeeded (may be empty map if no blocks configured yet)
 */
let _cache: Map<string, string> | null | false = null
let _fetchPromise: Promise<void> | null = null

function buildCacheKey(key: string, lang: Lang): string {
  return `${key}.${lang}`
}

async function fetchContentBlocks(): Promise<void> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/content-blocks`)
    if (!res.ok) {
      _cache = false
      return
    }
    const json = await res.json() as { success?: boolean; data?: Record<string, string> }
    if (json.success && json.data && typeof json.data === 'object') {
      _cache = new Map(Object.entries(json.data))
    } else {
      _cache = false
    }
  } catch (err) {
    console.warn('[usePageContent] failed to fetch content blocks:', err)
    _cache = false
  }
}

function ensureFetched(): Promise<void> {
  if (_cache !== null) return Promise.resolve()   // already done (success or fail)
  if (_fetchPromise) return _fetchPromise          // in-flight
  _fetchPromise = fetchContentBlocks()
  return _fetchPromise
}

/**
 * Hook: fetch content blocks once, expose a resolver function.
 *
 * Usage:
 *   const { get, ready } = usePageContent()
 *   const greeting = get('hero.greeting', 'en', 'Hi, I\'m Bruno.')
 *
 * Resolver: returns API value if the key+lang is configured, else `fallback`.
 */
export function usePageContent() {
  const [ready, setReady] = useState(_cache !== null)

  useEffect(() => {
    if (_cache !== null) return   // already loaded
    ensureFetched().then(() => setReady(true))
  }, [])

  function get(key: string, lang: Lang, fallback: string): string {
    if (!_cache) return fallback
    const cached = _cache.get(buildCacheKey(key, lang))
    return cached !== undefined ? cached : fallback
  }

  return { get, ready }
}

/** Reset cache — used in tests and after a successful save in Content Editor */
export function resetContentCache() {
  _cache = null
  _fetchPromise = null
}
