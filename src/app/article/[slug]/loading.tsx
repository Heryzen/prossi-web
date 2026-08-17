export default function ArticleDetailLoading() {
  return (
    <div className="flex flex-col pt-[79px]">
      <div className="bg-white">
        <div className="relative w-full overflow-hidden h-[320px] md:h-[440px] rounded-b-[100px] bg-[#e8d9bd] animate-pulse" />
      </div>
      <div className="bg-white px-6 md:px-[100px] py-12">
        <div className="max-w-[813px] mx-auto flex flex-col gap-4">
          <div className="h-4 w-32 bg-[#f4ece4] rounded animate-pulse" />
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-4 w-full bg-[#f4ece4] rounded animate-pulse" />
          ))}
          <div className="h-4 w-2/3 bg-[#f4ece4] rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
