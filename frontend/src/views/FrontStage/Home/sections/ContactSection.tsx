import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import { contact, pick } from '@/content/portfolio'

export default function ContactSection() {
  const lang = useSelector((state: RootState) => state.ui.lang)

  return (
    <section className="contact" id="contact">
      {/* Stamp watermark — decorative background */}
      <img className="contact__stamp" src="/images/stamp.webp" alt="" aria-hidden="true" />

      <div>
        <span className="section-num">
          / 07 — {lang === 'en' ? 'GET IN TOUCH' : '聯繫'}
        </span>
        <h2 className="contact__lede" style={{ marginTop: 24 }}>
          {pick(contact.lede, lang)}
        </h2>
        <a href={`mailto:${contact.links[0].href.replace('mailto:', '')}`} className="btn btn-solid">
          {lang === 'en' ? 'Email me' : '寄信給我'} →
        </a>
      </div>

      <ul className="contact__list">
        {contact.links.map((link) => (
          <li key={link.k}>
            <span className="k">{link.k}</span>
            <a
              className="v"
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              {link.v}
            </a>
            <span className="arr">{link.arr}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
