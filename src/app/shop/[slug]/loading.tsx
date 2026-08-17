export default function ProductLoading() {
  return (
    <section className="bg-white w-full pt-[100px] pb-[80px] px-6 md:px-[160px]">
      <div className="max-w-[1120px] mx-auto flex flex-col gap-8">
        <div className="h-6 w-16 bg-[#f4ece4] rounded animate-pulse" />
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-[480px] h-[360px] md:h-[480px] shrink-0 rounded-[20px] bg-[#f4ece4] animate-pulse" />
          <div className="flex flex-col gap-4 flex-1">
            <div className="h-4 w-32 bg-[#f4ece4] rounded animate-pulse" />
            <div className="h-8 w-2/3 bg-[#f4ece4] rounded animate-pulse" />
            <div className="h-7 w-24 bg-[#f4ece4] rounded animate-pulse" />
            <div className="h-4 w-full bg-[#f4ece4] rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-[#f4ece4] rounded animate-pulse" />
            <div className="h-12 w-40 bg-[#f4ece4] rounded-[100px] animate-pulse mt-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
