function Title({ title }: { title: string }) {
  return (
    <>
      <div className="flex justify-center  mb-12">
        <h2 className="relative text-center text-2xl font-bold bg-white px-2 after:content-[''] after:block after:rounded-full after:h-1 after:w-1 after:absolute after:bg-[#C1C1C1] before:-left-10 before:top-1/2 before:-translate-y-1/2 before:z-10 before:content-[''] before:block before:rounded-full before:h-1 before:w-1 before:absolute before:bg-[#C1C1C1] after:-right-10 after:top-1/2 after:-translate-y-1/2 after:z-10">
          {title}
          <span className="w-[170%] bg-[#C1C1C1] absolute -z-[1] -translate-y-1/2 top-1/2 h-[1px] -left-9 " />
        </h2>
      </div>
    </>
  )
}

export default Title
