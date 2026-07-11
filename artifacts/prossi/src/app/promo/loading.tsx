export default function PromoLoading() {
  return (
    <main className="min-h-screen bg-[#f4ece4] px-6 md:px-[100px] pt-[160px] pb-[80px]">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-40 bg-white/60 rounded animate-pulse" />
          <div className="h-5 w-[420px] max-w-full bg-white/60 rounded animate-pulse" />
        </div>
        <div className="flex flex-col gap-8 w-full">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="bg-[#f1e7da] rounded-[32px] overflow-hidden flex flex-col md:flex-row">
              <div className="flex flex-col gap-4 p-8 md:p-[60px] md:max-w-[547px] flex-1">
                <div className="h-8 w-3/4 bg-white/60 rounded animate-pulse" />
                <div className="h-4 w-full bg-white/60 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-white/60 rounded animate-pulse" />
                <div className="h-11 w-40 bg-white/60 rounded-full animate-pulse mt-2" />
              </div>
              <div className="flex-1 min-h-[240px] bg-white/40 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
