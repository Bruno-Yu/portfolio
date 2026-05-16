import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store/index'
import { setActiveSection } from '@/store/ui-slice'
import { useBlog } from '@/api/blog'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ExperienceSection from './sections/ExperienceSection'
import WorksSection from './sections/WorksSection'
import SkillsSection from './sections/SkillsSection'
import ServicesSection from './sections/ServicesSection'
import ContactSection from './sections/ContactSection'
import { fallbackSkills, fallbackWorks } from '@/content/apiFallback'

// Map section IDs → the nav href they belong to
const SECTION_NAV_MAP: Record<string, string> = {
  home: '/',
  about: '#about',
  experience: '#about',
  works: '#about',
  skills: '#about',
  services: '#about',
  contact: '#contact',
}

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const blogApi = useBlog()

  const [selfContent, setSelfContent] = useState<Record<string, unknown> | null>(null)
  const [works, setWorks] = useState<unknown[]>(fallbackWorks)
  const [skills, setSkills] = useState<unknown[]>(fallbackSkills)

  useEffect(() => {
    async function fetchAll() {
      const [selfRes, worksRes, skillsRes] = await Promise.allSettled([
        blogApi.querySelfContent(),
        blogApi.queryWorks(),
        blogApi.querySkills(),
      ])

      if (selfRes.status === 'fulfilled' && selfRes.value.success) {
        setSelfContent(selfRes.value.data)
      }
      if (worksRes.status === 'fulfilled' && worksRes.value.success && worksRes.value.data?.length) {
        setWorks(worksRes.value.data)
      }
      if (skillsRes.status === 'fulfilled' && skillsRes.value.success && skillsRes.value.data?.length) {
        setSkills(skillsRes.value.data)
      }
    }

    fetchAll()
  }, [])

  // Scroll-spy: observe sections and update active nav in Rail
  useEffect(() => {
    const sectionIds = Object.keys(SECTION_NAV_MAP)
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (els.length === 0) return

    // Track which sections are intersecting; pick the topmost one
    const intersecting = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id
          if (entry.isIntersecting) {
            intersecting.add(id)
          } else {
            intersecting.delete(id)
          }
        }
        // Pick the section closest to the top of the viewport
        const sorted = [...intersecting].sort((a, b) => {
          const ra = document.getElementById(a)?.getBoundingClientRect().top ?? 0
          const rb = document.getElementById(b)?.getBoundingClientRect().top ?? 0
          return ra - rb
        })
        const topSection = sorted[0] ?? ''
        dispatch(setActiveSection(SECTION_NAV_MAP[topSection] ?? ''))
      },
      { threshold: 0.15 },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [dispatch])

  return (
    <>
      <HeroSection
        summary={selfContent?.briefIntro as string | undefined}
      />
      <AboutSection />
      <ExperienceSection />
      <WorksSection works={works as never[]} />
      <SkillsSection skills={skills as never[]} />
      <ServicesSection />
      <ContactSection />
    </>
  )
}
