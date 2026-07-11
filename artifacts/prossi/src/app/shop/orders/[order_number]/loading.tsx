export default function OrderTrackingLoading() {
  return (
    <section className="bg-white w-full pt-[100px] pb-[80px] px-6 md:px-[160px]">
      <div className="max-w-[700px] mx-auto flex flex-col gap-8">
        <div className="h-4 w-20 bg-[#f4ece4] rounded animate-pulse" />
        <div className="h-8 w-48 bg-[#f4ece4] rounded animate-pulse" />
        <div className="flex gap-3">
          <div className="h-9 w-32 bg-[#f4ece4] rounded-[100px] animate-pulse" />
          <div className="h-9 w-40 bg-[#f4ece4] rounded-[100px] animate-pulse" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-5 w-full bg-[#f4ece4] rounded animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}
