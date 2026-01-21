import { useRef, useState, useEffect } from 'react'
import Card from '../../../components/Works/Card'
import Pagination from '../../../components/Works/Pagination'
import Modal from '@/components/common/Modal'
import ModalContent from '../../../components/Works/ModalContent'
import { useBlog } from '@/api/blog'
import { getImageUrl } from '@/utils/index'

export default function () {
  const dialog = useRef()
  const [dialogContent, setDialogContent] = useState({})
  const handleClick = (item) => {
    setDialogContent(item)
    dialog.current.open()
  }

  const blogApi = useBlog()
  const [works, setWorks] = useState()
  const [pagination, setPagination] = useState({ currentPage: 1, totalPage: 1 })

  useEffect(() => {
    async function getWorks() {
      const result = await blogApi.queryWorks()
      // New API format: { success: true, data: [...], meta: { pagination: {...} } }
      if (result.success) {
        setWorks(result.data)
        if (result.meta?.pagination) {
          setPagination({
            currentPage: result.meta.pagination.currentPage || 1,
            totalPage: result.meta.pagination.totalPages || 1,
          })
        }
      } else {
        setWorks([])
      }
    }
    getWorks()
  }, [])

  return (
    <>
      <div className="relative container mx-auto min-[992px] max-w-[1296px] p-3">
        <div
          className="absolute  left-0 h-[300px] w-full -z-10"
          style={{ backgroundImage: `url('${getImageUrl('works-banner')}')` }}
        />
        <div className="py-10 text-slate-100">
          <p className="text-xl text-center leading-relaxed">
            透過不斷解決問題和精進自己，發現
            <span className="bg-[url('src/assets/images/mark.png')] bg-bottom bg-no-repeat p-0">
              自身的成長與價值
            </span>
          </p>
          <div></div>
          {/* <ul className="flex flex-col sm:flex-row sm:justify-between w-full gap-x-2 gap-y-4 sm:w-2/3 mx-auto pt-10">
              {EXPERIENCES.map((e, idx) => (
                <ExperienceCard key={idx} title={e.title} content={e.content} />
              ))}
            </ul> */}
        </div>
        {/* card list */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-10 py-10">
          {works &&
            works?.map((item) => (
              <Card
                key={item.id}
                data={item}
                className="rounded-xl shadow pb-3"
                onClick={() => handleClick(item)}
              />
            ))}
        </ul>
        {/* pagination */}
        <Pagination currentPage={pagination.currentPage} totalPage={pagination.totalPage} />
      </div>
      <Modal ref={dialog}>
        <ModalContent content={dialogContent} />
      </Modal>
    </>
  )
}
