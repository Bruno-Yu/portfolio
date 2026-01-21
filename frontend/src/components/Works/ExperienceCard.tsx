function ExperienceCard({
  title,
  content,
}: {
  title: string
  content: string[]
}) {
  const description = content.join('、')

  return (
    <>
      <li className="w-full sm:max-w-[300px]">
        <p className="relative text-center text-sm mb-2 text-[#5B5B5B] after:content-[''] after:block after:border-b-[2px] after:border-[#c1c1c1] after:absolute after:w-6 after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:translate-y-1  after:z-50">
          {title}
        </p>
        <p className="text-center text-[#3B3B3B] text-wrap">{description}</p>
      </li>
    </>
  )
}

export default ExperienceCard
