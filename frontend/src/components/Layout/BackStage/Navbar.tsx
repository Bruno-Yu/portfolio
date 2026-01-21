import type { FC } from 'react'
import { Button, Navbar } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userActions } from '@/store/user-slice'
import { Local } from '@/utils'
import { getSystemName, getBaseUrl } from '@/config'

const BackStageNavbar: FC = function () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const handleLogout = () => {
    dispatch(userActions.logout())
    Local.remove('authState')
    navigate(`${getBaseUrl()}login`)
  }

  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand href={`${getBaseUrl()}contents`}>
              {/* <img alt="" src="/images/logo.svg" className="mr-3 h-6 sm:h-8" /> */}
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                {getSystemName()}
              </span>
            </Navbar.Brand>
          </div>
          <div className="flex items-center gap-3">
            <iframe
              height="30"
              src="https://ghbtns.com/github-btn.html?user=Bruno-Yu&repo=portfolio&type=star&count=true&size=large"
              title="GitHub"
              width="90"
              className="hidden sm:block"
            />
            <Button type="button" color="primary" onClick={handleLogout}>
              登出
            </Button>
          </div>
        </div>
      </div>
    </Navbar>
  )
}

export default BackStageNavbar
