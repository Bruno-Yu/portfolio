import { Pagination } from 'swiper/modules'
import { Fragment } from 'react/jsx-runtime'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getImageUrl, getResponsiveValue } from '@/utils/index'
import { useResponsiveValue } from '@/Hooks/useResponsiveValue'
import Title from '../../../components/Home/Title'
import 'swiper/css'
import 'swiper/css/pagination'

const CARDS = [
  {
    imgLink: 'article-image1',
    title: 'Vision Pro 登場！Vision Pro UI/UX 設計重點大公開 (上)',
    tag: 'UI/UX 新知',
    date: '2024/02/10',
  },
  {
    imgLink: 'article-image2',
    title: '給設計師和工程師的 Figma-Dev Mode 開發模式使用指南 (下)',
    tag: 'UI/UX 新知',
    date: '2023/11/20',
  },
  {
    imgLink: 'article-image3',
    title: '給設計師和工程師的 Figma-Dev Mode 開發模式使用指南 (上)',
    tag: 'UI/UX 新知',
    date: '2023/10/18',
  },
  {
    imgLink: 'article-image4',
    title: '給設計師和工程師的 Figma-Dev Mode 開發模式使用指南 (上)',
    tag: 'UI/UX 新知',
    date: '2023/10/18',
  },
  {
    imgLink: 'article-image5',
    title: '給設計師和工程師的 Figma-Dev Mode 開發模式使用指南 (上)',
    tag: 'UI/UX 新知',
    date: '2023/10/18',
  },
  {
    imgLink: 'article-image6',
    title: '給設計師和工程師的 Figma-Dev Mode 開發模式使用指南 (上)',
    tag: 'UI/UX 新知',
    date: '2023/10/18',
  },
]

const swiperBreakpoints = {
  320: 1,
  768: 2,
  1024: 3,
}

function Carousel() {
  const [number, width] = useResponsiveValue(swiperBreakpoints)
  return (
    <>
      <div className="py-10">
        <Title title={'精選文章'} />
        <div className="container mx-auto min-[992px] max-w-[1296px] border p-3">
          <div className="mx-auto">
            <Swiper
              modules={[Pagination]}
              spaceBetween={20}
              slidesPerView={number}
              pagination={{ clickable: true }}
            >
              {CARDS.map((e, idx) => (
                <SwiperSlide key={e.imgLink}>
                  <div className="flex flex-col gap-y-2">
                    <img
                      className="rounded-lg w-full h-auto"
                      src={getImageUrl(e.imgLink)}
                      alt={e.imgLink}
                    />
                    <p className="font-bold text-lg">{e.title}</p>
                    <div className="flex justify-between">
                      <div className="text-xs font-thin bg-[#F1F1F1] rounded-full py-0.5 px-2">
                        {e.tag}
                      </div>
                      <div className="text-xs font-thin">{e.date}</div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  )
}

export default Carousel
