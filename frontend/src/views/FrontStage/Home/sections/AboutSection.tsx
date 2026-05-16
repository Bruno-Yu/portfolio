import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import { about, pick } from '@/content/portfolio'

interface AboutSectionProps {
  /** Optional API-provided about text; falls back to static content */
  apiAbout?: string
}

export default function AboutSection({ apiAbout: _ }: AboutSectionProps) {
  const lang = useSelector((state: RootState) => state.ui.lang)

  const paragraphs = about.paragraphs[lang]

  return (
    <section className="section" id="about">
      <div className="section__head">
        <span className="section-num">/ 01</span>
        <h2 className="section-title">
          {lang === 'en' ? 'Quick intro' : '簡短介紹'}
        </h2>
      </div>

      <div className="about__grid">
        {/* Left: paragraphs */}
        <div className="about__lede">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Right: fact list */}
        <div className="about__side">
          <ul className="about__list">
            {about.facts.map((fact, i) => (
              <li key={i}>
                <span className="k">{pick(fact.k, lang)}</span>
                <span className="v">{pick(fact.v, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
