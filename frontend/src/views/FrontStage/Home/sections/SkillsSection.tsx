import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'

interface SkillDetail {
  name?: string
  label?: string
}

interface SkillGroup {
  id?: number | string
  title?: string
  name?: string
  category?: string
  iconCategory?: string
  details?: (string | SkillDetail)[]
  items?: (string | SkillDetail)[]
  order?: number
}

interface SkillsSectionProps {
  skills?: SkillGroup[]
}

/** Extract display name from skill detail (can be string or object) */
function getDetailName(detail: string | SkillDetail): string {
  if (typeof detail === 'string') return detail
  return detail.name || detail.label || ''
}

/** Extract group title */
function getGroupTitle(group: SkillGroup, lang: string): string {
  if (typeof group.title === 'object' && group.title !== null) {
    const t = group.title as { en?: string; zh?: string }
    return lang === 'zh' ? t.zh || t.en || '' : t.en || ''
  }
  return group.title || group.name || group.category || group.iconCategory || ''
}

export default function SkillsSection({ skills = [] }: SkillsSectionProps) {
  const lang = useSelector((state: RootState) => state.ui.lang)

  return (
    <section className="section" id="skills">
      <div className="section__head">
        <span className="section-num">/ 04</span>
        <h2 className="section-title">
          {lang === 'en' ? 'Stack' : '技能'}
        </h2>
      </div>

      {skills.length === 0 ? (
        <p style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          {lang === 'en' ? 'Loading skills…' : '載入中…'}
        </p>
      ) : (
        <div className="skills">
          {skills.map((group, i) => {
            const rawItems = group.details || group.items || []
            // API may return details as a JSON-encoded string — parse if needed
            const items: (string | SkillDetail)[] = typeof rawItems === 'string'
              ? (() => { try { return JSON.parse(rawItems as string) } catch { return [] } })()
              : rawItems
            const groupTitle = getGroupTitle(group, lang)

            return (
              <div key={group.id || i} className="skills__group">
                <div className="skills__group-title">{groupTitle}</div>
                {items.map((item, j) => {
                  const name = getDetailName(item)
                  return (
                    <div key={j} className="skill-row">
                      <div>
                        <div className="skill-row__name">{name}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
