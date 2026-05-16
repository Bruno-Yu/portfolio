import { useState, useEffect } from 'react'
import AdminPageHead from '@/components/Layout/BackStage/AdminPageHead'
import { getApiBaseUrl } from '@/config'

/* ─── Types ─────────────────────────────────────────────────── */
interface DailyPoint { date: string; requests: number; uniques: number }
interface AnalyticsData {
  totalRequests: number
  uniqueVisitors: number
  daily: DailyPoint[]
}
interface AnalyticsResponse {
  success: boolean
  data?: AnalyticsData
  error?: { code: string }
}

/* ─── Sparkline ─────────────────────────────────────────────── */
function Sparkline({ daily }: { daily: DailyPoint[] }) {
  if (daily.length === 0) {
    return (
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', padding: '20px 0' }}>
        No data available
      </p>
    )
  }

  const W = 560
  const H = 80
  const PAD = 4

  const vals = daily.map(d => d.requests)
  const max = Math.max(...vals, 1)
  const points = vals.map((v, i) => {
    const x = PAD + (i / Math.max(vals.length - 1, 1)) * (W - PAD * 2)
    const y = H - PAD - ((v / max) * (H - PAD * 2))
    return { x, y }
  })

  // Build smooth bezier path
  function smoothPath(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return ''
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1]
      const p1 = pts[i]
      const cx = (p0.x + p1.x) / 2
      d += ` C ${cx} ${p0.y} ${cx} ${p1.y} ${p1.x} ${p1.y}`
    }
    return d
  }

  const linePath = smoothPath(points)
  const last = points[points.length - 1]
  const first = points[0]
  const areaPath = `${linePath} L ${last.x} ${H} L ${first.x} ${H} Z`

  // Axis labels — first, mid, last date
  const labels = [daily[0], daily[Math.floor(daily.length / 2)], daily[daily.length - 1]].filter(Boolean)
  const labelPositions = [PAD, W / 2, W - PAD]

  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: '100%', maxWidth: W, height: 'auto' }} aria-hidden="true">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-y)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent-y)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#spark-fill)" />
      <path d={linePath} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {/* axis labels */}
      {labels.map((pt, i) => (
        <text
          key={i}
          x={labelPositions[i]}
          y={H + 16}
          textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--ink-3)' }}
        >
          {pt.date.slice(5)} {/* MM-DD */}
        </text>
      ))}
    </svg>
  )
}

/* ─── StatCard ─────────────────────────────────────────────── */
interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  tick?: string
  isDown?: boolean
  unavailable?: boolean
}
function StatCard({ label, value, delta, tick, isDown, unavailable }: StatCardProps) {
  return (
    <div className="stat">
      {tick && <span className="stat__tick">{tick}</span>}
      <span className="k">{label}</span>
      <span className="v">{unavailable ? '—' : value}</span>
      {delta && !unavailable && (
        <span className={`delta${isDown ? ' is-down' : ''}`}>{delta}</span>
      )}
      {unavailable && (
        <span className="delta">Analytics unavailable</span>
      )}
    </div>
  )
}

/* ─── Recent activity (static placeholder) ──────────────────── */
const ACTIVITY = [
  { type: 'y', text: 'Backstage v2 launched', time: 'Today' },
  { type: 'n', text: 'Content editor connected to API', time: 'Today' },
  { type: 'y', text: 'CF Analytics proxy configured', time: 'Earlier' },
  { type: 'n', text: 'DB migration 0003 applied', time: 'Earlier' },
  { type: 'y', text: 'Design system v2 deployed', time: 'This week' },
]

/* ─── OverviewPage ───────────────────────────────────────────── */
export default function OverviewPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsErr, setAnalyticsErr] = useState(false)
  const [worksCount, setWorksCount] = useState<number | null>(null)
  const [msgCount, setMsgCount] = useState<number | null>(null)

  useEffect(() => {
    const token = getToken()
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}

    // Analytics
    fetch(`${getApiBaseUrl()}/api/admin/analytics?days=30`, { headers })
      .then(r => r.json())
      .then((d: AnalyticsResponse) => {
        if (d.success && d.data) setAnalytics(d.data)
        else setAnalyticsErr(true)
      })
      .catch(() => setAnalyticsErr(true))

    // Works count
    fetch(`${getApiBaseUrl()}/api/works`, { headers })
      .then(r => r.json())
      .then((d: { success?: boolean; data?: unknown[] }) => {
        if (d.success && Array.isArray(d.data)) setWorksCount(d.data.length)
      })
      .catch(() => {})

    // Messages count
    fetch(`${getApiBaseUrl()}/api/messages?count=true`, { headers })
      .then(r => r.json())
      .then((d: { success?: boolean; data?: { count?: number } }) => {
        if (d.success && d.data) setMsgCount(d.data.count ?? 0)
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <AdminPageHead
        title="Overview"
        description="Site statistics for the last 30 days"
      />

      {/* ── Stat cards ─────────────────────────────────── */}
      <div className="admin-stat-row">
        <StatCard
          label="Total visits (30D)"
          value={analytics?.totalRequests.toLocaleString() ?? '—'}
          tick="30D"
          unavailable={analyticsErr}
        />
        <StatCard
          label="Unique visitors (30D)"
          value={analytics?.uniqueVisitors.toLocaleString() ?? '—'}
          tick="30D"
          unavailable={analyticsErr}
        />
        <StatCard
          label="Works published"
          value={worksCount ?? '—'}
        />
        <StatCard
          label="Messages"
          value={msgCount ?? '—'}
        />
      </div>

      {/* ── Sparkline panel ────────────────────────────── */}
      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel__head">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            Daily requests — last 30 days
          </span>
        </div>
        <div style={{ padding: '20px 24px' }}>
          {analyticsErr ? (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
              Analytics unavailable — set CF_ANALYTICS_API_TOKEN and CF_ZONE_ID secrets
            </p>
          ) : analytics ? (
            <Sparkline daily={analytics.daily} />
          ) : (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
              Loading…
            </p>
          )}
        </div>
      </div>

      {/* ── Recent activity panel ──────────────────────── */}
      <div className="panel">
        <div className="panel__head">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            Recent activity
          </span>
        </div>
        <ul className="activity" style={{ padding: '16px 24px', margin: 0 }}>
          {ACTIVITY.map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingBottom: 14 }}>
              <span
                className={`marker-dot${item.type === 'y' ? ' is-y' : ''}`}
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5 }}>{item.text}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', marginTop: 3 }}>
                  {item.time}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('authState')
    if (!raw) return null
    return (JSON.parse(raw) as { accessToken?: string }).accessToken ?? null
  } catch { return null }
}
