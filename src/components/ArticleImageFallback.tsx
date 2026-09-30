export function ArticleImageFallback({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{ background: "linear-gradient(160deg, #f4ece4 0%, #e8d9bd 55%, #ddc48a 100%)" }}
    >
      <span className="font-sans font-semibold text-[22px] tracking-wide text-[#8a6a2f]">PROSSI</span>
    </div>
  );
}
