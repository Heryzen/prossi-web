export default function DoctorsLoading() {
  return (
    <>
      <div className="relative w-full h-[420px] md:h-[600px] overflow-hidden rounded-b-[60px] md:rounded-b-[100px] bg-[#e8d9bd] animate-pulse" />
      <section className="bg-[#fff8f2] w-full py-[60px] md:py-[100px] px-6 md:px-[100px]">
        <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-[40px] md:gap-[60px]">
          <div className="h-8 w-64 bg-white rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 w-full">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-6">
                <div className="w-[260px] h-[260px] md:w-[322px] md:h-[322px] rounded-full bg-white animate-pulse" />
                <div className="h-5 w-40 bg-white rounded animate-pulse" />
                <div className="h-10 w-full max-w-[280px] bg-white rounded-[100px] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
