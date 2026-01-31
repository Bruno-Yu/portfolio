import { Icon } from '@iconify/react'
import { Fragment } from 'react/jsx-runtime'
import { getImageUrl } from '../../../utils/index'
import { useState, useEffect } from 'react'
import { IoLogoGithub, IoMailOutline, IoLogoLinkedin } from 'react-icons/io5'
import { useBlog } from '@/api/blog'

const ICONS = {
  Github: IoLogoGithub,
  Email: IoMailOutline,
  Linkedin: IoLogoLinkedin,
}

function Banner() {
  const blogApi = useBlog()
  const [selfContent, setSelfContent] = useState()
  const [socialMedia, setSocialMedia] = useState()
  async function getBannerInfo() {
    const selfContentResult = await blogApi.querySelfContent()
    const socialMediaResult = await blogApi.querySocialMedia()
    // New API format: { success: true, data: [...] }
    setSelfContent(selfContentResult.success ? selfContentResult.data : null)
    setSocialMedia(socialMediaResult.success ? socialMediaResult.data : [])
  }
  useEffect(() => {
    getBannerInfo()
  }, [])
  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row  sm:justify-between">
        <div className="flex flex-col justify-center items-center sm:w-2/5 px-5 ">
          <div>
            <h1 className="text-2xl text-center sm:text-left font-bold mb-2.5">
              {selfContent && selfContent.briefIntro}
            </h1>
            <p className="text-[#5B5B5B] text-left text-sm mb-2 whitespace-pre-wrap">
              {selfContent && selfContent.about}
            </p>
            <p className="text-[#C1C1C1] text-center sm:text-left text-xs mb-5">
              {selfContent && selfContent.hashTags && (Array.isArray(selfContent.hashTags) ? selfContent.hashTags.join(' / ') : '')}
            </p>
            <div className="flex justify-center sm:justify-start gap-3">
              {socialMedia &&
                socialMedia?.map((media) => {
                  const IconComponent = ICONS[media.name]
                  return (
                    <Fragment key={media.name}>
                      <a href={media.link} className="block">
                        {IconComponent && (
                          <IconComponent className="text-[#5B5B5B] w-6 h-6" />
                        )}
                      </a>
                    </Fragment>
                  )
                })}
            </div>
          </div>
        </div>

        <img
          className="hidden sm:block w-3/5 h-auto"
          src={getImageUrl('hero-lg')}
          alt="hero-lg"
        />
        <img
          className="block sm:hidden w-full h-auto"
          src={getImageUrl('hero-sm')}
          alt="hero-sm"
        />
      </div>
    </>
  )
}

export default Banner
