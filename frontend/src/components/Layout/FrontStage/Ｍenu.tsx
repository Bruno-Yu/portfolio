import { useSelector } from 'react-redux'
import { Navbar } from 'flowbite-react'
import { frontRoutes } from '@/routes.ts'
import { getSystemName, getBaseUrl } from '@/config'

export default function () {
  const userName = useSelector((state: { user: { name?: string } }) => state.user.name)

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href={`${getBaseUrl()}`}>
        <span className="whitespace-nowrap text-xl font-semibold dark:text-white">
          {userName || getSystemName()}
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {frontRoutes.map((nav) => (
          <Navbar.Link href={nav.path} key={nav.key || nav.name}>
            {nav.title}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  )
}
