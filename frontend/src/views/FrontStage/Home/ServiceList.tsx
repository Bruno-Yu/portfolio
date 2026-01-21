import { useState, useEffect, FunctionComponent } from 'react'
import ServiceCard from '../../../components/Home/ServiceCard'
import { useBlog } from '@/api/blog'

export type ServiceListType = {
  className?: string
}

const ServiceList: FunctionComponent<ServiceListType> = ({
  className = '',
}) => {
  const blogApi = useBlog()
  const [skills, setSkills] = useState()
  useEffect(() => {
    async function getSkills() {
      const result = await blogApi.querySkills()
      // New API format: { success: true, data: [...] }
      setSkills(result.success ? result.data : [])
    }
    getSkills()
  }, [])
  return (
    // bg-[url('@/assets/images/homepage-services-bg.png')]
    <div className="py-5  ">
      {/* <Title title={'技術/能力'} /> */}
      {/* service list */}
      <div
        className={`container mx-auto min-[992px] max-w-[1296px] p-3 ${className}`}
      >
        <div className="flex-1 mx-auto flex justify-center flex-wrap content-start gap-6 max-w-full z-[1]">
          {skills &&
            skills?.map((service, idx) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                details={service.details}
              />
            ))}
        </div>
      </div>
      {/* button */}
      {/* <div className="flex justify-center mt-12">
        <p className=" leading-[34px] font-semibold text-2xl mq450:leading-[27px] mb-10">
          想要合作或瞭解更多？
        </p>
      </div>
      <div className="flex items-center justify-center ">
        <button
          type="button"
          className=" leading-[30px] font-semibold text-white text-xl bg-black py-3 px-4 rounded"
        >
          詳細內容與合作流程
        </button>
      </div> */}
    </div>
  )
}

export default ServiceList
