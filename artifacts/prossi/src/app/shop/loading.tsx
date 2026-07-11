export default function ShopLoading() {
  return (
    <>
      <div className="relative w-full h-[320px] md:h-[440px] overflow-hidden rounded-b-[60px] md:rounded-b-[100px] bg-[#e8d9bd] animate-pulse" />
      <section className="bg-white w-full py-[60px] md:py-[84px] px-6 md:px-[160px]">
        <div className="max-w-[1120px] mx-auto flex flex-col gap-8">
          <div className="h-12 w-full max-w-[320px] rounded-[100px] bg-[#f4ece4] animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-[20px] overflow-hidden border border-[#e6ecf7]">
                <div className="w-full h-[234px] bg-[#f4ece4] animate-pulse" />
                <div className="flex flex-col gap-3 p-5">
                  <div className="h-4 w-3/4 bg-[#f4ece4] rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-[#f4ece4] rounded animate-pulse" />
                  <div className="h-10 w-full bg-[#f4ece4] rounded-[100px] animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
