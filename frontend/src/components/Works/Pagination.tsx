import { NavLink } from 'react-router-dom'

function Pagination({
  currentPage,
  totalPage,
}: {
  currentPage: number
  totalPage: number
}) {
  return (
    <>
      <div className="flex justify-center">
        <nav aria-label="Page navigation example">
          <ul className="flex items-center h-8 text-sm">
            {Array(totalPage)
              .fill(null)
              .map((_, idx) => (
                <li key={idx}>
                  <NavLink
                    to={'/works'}
                    aria-current={currentPage === idx + 1 ? 'page' : false}
                    className="flex items-center justify-center px-3 h-8 rounded leading-tight text-black active:text-white bg-white active:bg-black hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    {idx + 1}
                  </NavLink>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Pagination
