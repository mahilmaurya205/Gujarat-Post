export default function NewsLoader({ fullPage = false }: { fullPage?: boolean }) {
  return (
    <div className={`news-loader ${fullPage ? 'news-loader-page' : ''}`} role="status" aria-live="polite" aria-label="Loading Gujarat Post">
      <div className="news-loader-stage" aria-hidden="true">
        <div className="news-loader-rings"><span /><span /><span /></div>
        <div className="news-loader-mic">
          <div className="news-loader-mic-head"><i /><i /><i /></div>
          <div className="news-loader-mic-neck" />
          <div className="news-loader-mic-flag"><b>GP</b><small>NEWS</small></div>
          <div className="news-loader-mic-handle" />
          <div className="news-loader-mic-base" />
        </div>
        <div className="news-loader-orbit"><span>LIVE</span></div>
      </div>
      <div className="news-loader-copy"><strong>Gujarat Post</strong><span>Bringing the story to you</span></div>
      <div className="news-loader-bar"><span /></div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
