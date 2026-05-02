import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import { experience, pick } from '@/content/portfolio'

export default function ExperienceSection() {
  const lang = useSelector((state: RootState) => state.ui.lang)

  return (
    <section className="section" id="experience">
      <div className="section__head">
        <span className="section-num">/ 02</span>
        <h2 className="section-title">
          {lang === 'en' ? 'Experience' : '工作經歷'}
        </h2>
      </div>

      <div className="exp">
        {experience.map((item, i) => (
          <div key={i} className="exp__row">
            <div className="exp__period">{item.period}</div>

            <div>
              <div className="exp__company">
                {pick(item.company, lang)}
              </div>
              <div className="exp__role">
                {pick(item.role, lang)} · {item.location}
              </div>
              <div className="exp__stack">
                {item.stack.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>

            <ul className="exp__bullets">
              {item.bullets[lang].map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
