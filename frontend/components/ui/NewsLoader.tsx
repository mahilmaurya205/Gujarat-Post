export default function NewsLoader({ fullPage = false }: { fullPage?: boolean }) {
  return (
    <div className={`news-loader ${fullPage ? 'news-loader-page' : ''}`} role="status" aria-live="polite" aria-label="Loading Gujarat Post">
      <div className="news-loader-stage" aria-hidden="true">
        {/* Modern Spinner */}
        <div className="relative flex items-center justify-center h-20 w-20">
          <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-t-[#B3121B] border-r-transparent border-b-[#B3121B] border-l-transparent" />
          <div className="absolute animate-pulse text-[10px] font-black text-white bg-[#B3121B] h-6 w-6 rounded-full flex items-center justify-center shadow-md select-none">GP</div>
        </div>
      </div>
      
      <div className="news-loader-copy">
        <strong>Gujarat Post</strong>
        <span>Bringing the story to you</span>
      </div>
      <div className="news-loader-bar">
        <span />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}


