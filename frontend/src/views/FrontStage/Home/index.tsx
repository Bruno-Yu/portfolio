import { useState, useEffect } from 'react'
import { useBlog } from '@/api/blog'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ExperienceSection from './sections/ExperienceSection'
import WorksSection from './sections/WorksSection'
import SkillsSection from './sections/SkillsSection'
import ServicesSection from './sections/ServicesSection'
import ContactSection from './sections/ContactSection'

export default function HomePage() {
  const blogApi = useBlog()

  const [selfContent, setSelfContent] = useState<Record<string, unknown> | null>(null)
  const [works, setWorks] = useState<unknown[]>([])
  const [skills, setSkills] = useState<unknown[]>([])

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
      if (worksRes.status === 'fulfilled' && worksRes.value.success) {
        setWorks(worksRes.value.data || [])
      }
      if (skillsRes.status === 'fulfilled' && skillsRes.value.success) {
        setSkills(skillsRes.value.data || [])
      }
    }

    fetchAll()
  }, [])

  return (
    <>
      <HeroSection
        summary={selfContent?.briefIntro as string | undefined}
      />
      <AboutSection
        apiAbout={selfContent?.about as string | undefined}
      />
      <ExperienceSection />
      <WorksSection works={works as never[]} />
      <SkillsSection skills={skills as never[]} />
      <ServicesSection />
      <ContactSection />
    </>
  )
}
