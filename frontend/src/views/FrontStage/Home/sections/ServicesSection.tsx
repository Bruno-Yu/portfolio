import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import { services, pick } from '@/content/portfolio'

export default function ServicesSection() {
  const lang = useSelector((state: RootState) => state.ui.lang)

  return (
    <section className="section" id="services">
      <div className="section__head">
        <span className="section-num">/ 05</span>
        <h2 className="section-title">
          {lang === 'en' ? 'What I can do' : '我能解決什麼'}
        </h2>
      </div>

      <div className="services">
        {services.map((svc) => (
          <div key={svc.n} className="svc">
            <div className="svc__num">{svc.n}</div>
            <div className="svc__title">{pick(svc.title, lang)}</div>
            <div className="svc__lede">{pick(svc.lede, lang)}</div>
            <ul className="svc__bullets">
              {svc.bullets[lang].map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
