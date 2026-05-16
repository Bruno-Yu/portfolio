import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'

interface Work {
  id: number | string
  title: string
  description?: string
  content?: string          // full description from API
  imgUrl?: string           // API field
  imgLink?: string
  imageUrl?: string         // fallback
  cover?: string            // fallback
  tags?: string[]
  techStack?: string[]
  year?: number | string
  type?: string
  kind?: string
  gitHubUrl?: string        // API field
  githubUrl?: string        // fallback
  gitPageUrl?: string       // API field (live demo)
  demoUrl?: string          // fallback
}

interface WorksSectionProps {
  works?: Work[]
}

export default function WorksSection({ works = [] }: WorksSectionProps) {
  const lang = useSelector((state: RootState) => state.ui.lang)
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Work | null>(null)

  const displayed = works.slice(0, 6)

  function openModal(w: Work) {
    setSelected(w)
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    setSelected(null)
    document.body.style.overflow = ''
  }

  return (
    <section className="section" id="works">
      <div className="section__head">
        <span className="section-num">/ 03</span>
        <h2 className="section-title">
          {lang === 'en' ? 'Selected work' : '代表作品'}
        </h2>
      </div>

      {displayed.length === 0 ? (
        <p style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          {lang === 'en' ? 'Loading works…' : '載入中…'}
        </p>
      ) : (
        <div className="works">
          {displayed.map((w, i) => {
            const coverUrl = w.imgUrl || w.imgLink || w.imageUrl || w.cover || ''
            const tags = w.tags || w.techStack || []
            const kind = w.kind || w.type || ''
            const year = w.year || ''

            return (
              <article
                key={w.id}
                className="work"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal(w)}
              >
                <div className="work__head">
                  <span>/ {String(i + 1).padStart(2, '0')}</span>
                  <span>{year}</span>
                </div>

                {coverUrl ? (
                  <div className="work__cover">
                    <img src={coverUrl} alt={w.title} />
                  </div>
                ) : (
                  <div className="work__cover ph" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    letterSpacing: '0.1em', color: 'var(--ink-3)',
                  }}>
                    {kind.toUpperCase() || 'PROJECT'}
                  </div>
                )}

                <h3 className="work__title">{w.title}</h3>
                <p className="work__sum">{w.description || ''}</p>

                <div className="work__stack">
                  {tags.slice(0, 4).map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      )}

      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
        <button className="btn" onClick={() => navigate('/works')}>
          {lang === 'en' ? 'View all projects →' : '查看全部作品 →'}
        </button>
      </div>

      {/* ── Modal ── */}
      {selected && (
        <div className="work-modal-overlay" onClick={closeModal}>
          <div className="work-modal" onClick={(e) => e.stopPropagation()}>
            <div className="work-modal__header">
              <h2 className="work-modal__title">{selected.title}</h2>
              <button className="work-modal__close" onClick={closeModal}>✕</button>
            </div>

            {(selected.imgUrl || selected.imgLink || selected.imageUrl || selected.cover) && (
              <div className="work-modal__cover">
                <img
                  src={selected.imgUrl || selected.imgLink || selected.imageUrl || selected.cover}
                  alt={selected.title}
                />
              </div>
            )}

            <div className="work-modal__body">
              <p className="work-modal__desc">
                {selected.content || selected.description || ''}
              </p>

              {(selected.tags || selected.techStack || []).length > 0 && (
                <div className="work-modal__tags">
                  {(selected.tags || selected.techStack || []).map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}

              <div className="work-modal__links">
                {(selected.gitHubUrl || selected.githubUrl) && (
                  <a
                    className="btn"
                    href={selected.gitHubUrl || selected.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub ↗
                  </a>
                )}
                {(selected.gitPageUrl || selected.demoUrl) && (
                  <a
                    className="btn btn-solid"
                    href={selected.gitPageUrl || selected.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {lang === 'en' ? 'Live Demo ↗' : '線上預覽 ↗'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
