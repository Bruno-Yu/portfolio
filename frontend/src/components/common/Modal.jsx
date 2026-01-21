import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'

const Modal = forwardRef(function Modal({ children }, ref) {
  const dialog = useRef()
  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal()
      },
      close() {
        dialog.current.hideModal()
      },
    }
  })
  return createPortal(
    <dialog className="bg-white  rounded-lg" ref={dialog}>
      <div className="flex justify-end pt-6 px-6">
        <form method="dialog">
          <button>
            <Icon icon="mdi:close" className="text-[#5B5B5B] w-6 h-6" />
          </button>
        </form>
      </div>
      {children}
    </dialog>,
    document.getElementById('dialog')
  )
})

export default Modal
