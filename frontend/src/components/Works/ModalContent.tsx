import { Link, useNavigate } from 'react-router-dom'
import { getImageUrl } from '@/utils/index'

function ModalContent({ content }) {
  return (
    <div>
      {/* title */}
      <div className="pt-6 pb-8 px-6">
        <h2 className="font-bold text-2xl text-center mb-1">{content.title}</h2>
        <p className="text-[#919191] text-sm text-center">
          {content.description}
        </p>
      </div>
      {/* content */}
      <div className="grid grid-cols-12 gap-2 w-full pb-6  px-6">
        <div className="col-span-12 lg:col-span-7 pr-7">
          <p className="font-normal leading-7">{content.content}</p>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:border-l lg:pl-7">
          <p className="text-[#5B5B5B] leading-7">
            技術：{content.tags ? content.tags.join('、 ') : ''}
          </p>
          <p className="text-[#5B5B5B] leading-7">
            連結：<Link to={content.gitHubUrl}>GitHub</Link>、
            <Link to={content.gitPageUrl}>GitHub Page</Link>
          </p>
        </div>
      </div>
      {/* demo */}
      <div className="bg-[#FAFAFA] p-12 ">
        <img
          src={content.imgUrl}
          alt={content.imgUrl}
          className="w-full h-auto rounded-2xl"
        />
      </div>
    </div>
  )
}

export default ModalContent
