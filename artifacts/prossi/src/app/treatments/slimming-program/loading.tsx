export default function SlimmingProgramLoading() {
  return (
    <div className="bg-[#cd724f]">
      <div className="relative w-full overflow-hidden rounded-b-[100px] h-[400px] md:h-[560px] bg-[#b96540] animate-pulse" />
      <div className="px-6 md:px-[100px] py-[60px] md:py-[100px]">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-[24px] bg-white/10 h-[320px] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
