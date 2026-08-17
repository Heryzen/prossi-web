export default function ArticleListLoading() {
  return (
    <div className="flex flex-col pt-[79px]">
      <div className="bg-white">
        <div className="relative w-full overflow-hidden h-[320px] md:h-[440px] rounded-b-[100px] bg-[#e8d9bd] animate-pulse" />
      </div>
      <div className="bg-white px-6 md:px-[100px] py-12">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-10">
          <div className="flex gap-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-9 w-32 bg-[#f4ece4] rounded-full animate-pulse" />
            ))}
          </div>
          <div className="flex flex-col gap-8">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex flex-col md:flex-row items-stretch gap-8 w-full">
                <div className="rounded-[20px] shrink-0 w-full md:w-[440px] h-[246px] bg-[#f4ece4] animate-pulse" />
                <div className="flex flex-col gap-3 flex-1 justify-center">
                  <div className="h-3 w-24 bg-[#f4ece4] rounded animate-pulse" />
                  <div className="h-6 w-3/4 bg-[#f4ece4] rounded animate-pulse" />
                  <div className="h-4 w-full bg-[#f4ece4] rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-[#f4ece4] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
