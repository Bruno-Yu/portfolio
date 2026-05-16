import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import { useBlog } from '@/api/blog'

interface Work {
  id: number | string
  title: string
  description?: string
  content?: string          // full description from API
  summary?: string
  imgUrl?: string           // API field
  imgLink?: string          // API field
  imageUrl?: string
  cover?: string
  tags?: string[]
  techStack?: string[]
  year?: number | string
  type?: string
  kind?: string
  gitHubUrl?: string        // API field
  githubUrl?: string
  github?: string
  gitPageUrl?: string       // API field (live demo)
  demoUrl?: string
  demo?: string
}

interface SelectedWork extends Work {
  _open?: boolean
}

export default function WorksPage() {
  const lang = useSelector((state: RootState) => state.ui.lang)
  const navigate = useNavigate()
  const blogApi = useBlog()

  const [works, setWorks] = useState<Work[]>([])
  const [selected, setSelected] = useState<SelectedWork | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function fetchWorks() {
      const result = await blogApi.queryWorks()
      if (result.success) {
        setWorks(result.data || [])
        if (result.meta?.pagination) {
          setCurrentPage(result.meta.pagination.currentPage || 1)
          setTotalPages(result.meta.pagination.totalPages || 1)
        }
      }
    }
    fetchWorks()
  }, [currentPage])

  function openModal(work: Work) {
    setSelected(work)
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    setSelected(null)
    document.body.style.overflow = ''
  }

  return (
    <div className="works-page">
      {/* Page header */}
      <div className="works-page__header">
        <div>
          <span className="section-num">/ ALL WORKS</span>
          <h1 className="section-title" style={{ marginTop: 8 }}>
            {lang === 'en' ? 'Projects' : '所有作品'}
          </h1>
        </div>
        <a
          href="/"
          className="works-page__back"
          onClick={(e) => { e.preventDefault(); navigate('/') }}
        >
          ← {lang === 'en' ? 'Back' : '返回'}
        </a>
      </div>

      {/* Works grid */}
      {works.length === 0 ? (
        <p style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          {lang === 'en' ? 'Loading…' : '載入中…'}
        </p>
      ) : (
        <div className="works-grid">
          {works.map((w, i) => {
            const cover = w.imgUrl || w.imgLink || w.imageUrl || w.cover || ''
            const tags = w.tags || w.techStack || []
            const github = w.gitHubUrl || w.githubUrl || w.github || ''
            const demo = w.gitPageUrl || w.demoUrl || w.demo || ''

            return (
              <article
                key={w.id}
                className="work-card"
                onClick={() => openModal(w)}
                style={{ cursor: 'pointer' }}
              >
                <div className="work-card__cover">
                  {cover
                    ? <img src={cover} alt={w.title} />
                    : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)' }}>
                        {(w.kind || w.type || 'PROJECT').toUpperCase()}
                      </span>
                  }
                  <span className="work-card__num">/ {String(i + 1).padStart(2, '0')}</span>
                </div>

                <div className="work-card__body">
                  <div className="work-card__meta">
                    <span>{w.type || w.kind || ''}</span>
                    <span>{w.year || ''}</span>
                  </div>

                  <h2 className="work-card__title">{w.title}</h2>

                  <p className="work-card__desc">
                    {w.summary || w.description || ''}
                  </p>

                  <div className="work-card__tags">
                    {tags.slice(0, 5).map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>

                  {(github || demo) && (
                    <div
                      className="work-card__links"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {github && (
                        <a
                          className="work-link"
                          href={github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub ↗
                        </a>
                      )}
                      {demo && (
                        <a
                          className="work-link"
                          href={demo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {lang === 'en' ? 'Demo ↗' : '預覽 ↗'}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`page-btn${p === currentPage ? ' is-active' : ''}`}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="work-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="work-modal"
            onClick={(e) => e.stopPropagation()}
          >
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
                {selected.content || selected.summary || selected.description || ''}
              </p>

              {(selected.tags || selected.techStack || []).length > 0 && (
                <div className="work-modal__tags">
                  {(selected.tags || selected.techStack || []).map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}

              <div className="work-modal__links">
                {(selected.gitHubUrl || selected.githubUrl || selected.github) && (
                  <a
                    className="btn"
                    href={selected.gitHubUrl || selected.githubUrl || selected.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub ↗
                  </a>
                )}
                {(selected.gitPageUrl || selected.demoUrl || selected.demo) && (
                  <a
                    className="btn btn-solid"
                    href={selected.gitPageUrl || selected.demoUrl || selected.demo}
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
    </div>
  )
}
