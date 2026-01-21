import { FunctionComponent, useMemo, type CSSProperties } from 'react'
import { getImageUrl } from '@/utils/index'
import { LiaVuejs } from 'react-icons/lia'
import { MdOutlineWebAsset } from 'react-icons/md'
import { FaReact } from 'react-icons/fa'
import { FaCode } from 'react-icons/fa6'

export type ServiceCardType = {
  className?: string
  title?: string
  details?: string[]
  /** Style props */
  propMinWidth?: CSSProperties['minWidth']
}

const ICONS = {
  Vue: LiaVuejs,
  React: FaReact,
  Web_Layout: MdOutlineWebAsset,
  Others: FaCode,
}

const ServiceCard: FunctionComponent<ServiceCardType> = ({
  className = '',
  title,
  details,
  propMinWidth,
}) => {
  const b5Style: CSSProperties = useMemo(() => {
    return {
      minWidth: propMinWidth,
    }
  }, [propMinWidth])

  const IconComponent = useMemo(() => {
    const propString = title?.split(' ').join('_')
    return ICONS[propString as keyof typeof ICONS]
  }, [title])

  // Parse details if it's a JSON string from API
  const parsedDetails = useMemo(() => {
    if (!details) return []
    if (Array.isArray(details)) return details
    try {
      return JSON.parse(details)
    } catch {
      return []
    }
  }, [details])

  return (
    <div
      className={`relative  flex-1 rounded-2xl overflow-hidden flex flex-col items-center justify-start py-20 px-5 box-border gap-6 min-w-[229px] max-w-[306px] h-[306px] text-left text-3xl text-white font-normal bg-[url('@/assets/images/service-item-bg.png')] group hover:py-10 hover:bg-none hover:ring-4 hover:ring-black hover:ring-inset   ${className}`}
    >
      {/* 内容容器 */}
      <div className="relative z-10 flex flex-col items-center justify-start gap-6 w-full h-full group-hover:gap-3">
        <div className="flex flex-row items-start justify-start py-0 px-4 group-hover:hidden">
          {IconComponent && (
            <IconComponent className="h-20 w-20 relative overflow-hidden shrink-0" />
          )}
        </div>
        <b
          className="relative text-center leading-[42px] inline-block min-w-[112px] mq450:text-3xl mq450:leading-[34px] group-hover:text-black"
          style={b5Style}
        >
          {title}
        </b>
        <ul className="hidden text-left text-black text-xl leading-8 list-disc group-hover:block">
          {parsedDetails.map((ele) => <li key={ele}>{ele}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default ServiceCard
