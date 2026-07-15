'use client';

/* Shared shimmer animation base — applied via CSS class */
function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent ${className}`}
    />
  );
}

/* ── Single news card skeleton ──────────────────────────────── */
function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Shimmer className="aspect-[16/10] w-full rounded-xl" />
      <Shimmer className="h-3 w-16 rounded-full mt-1" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-4/5" />
      <Shimmer className="h-3 w-24 mt-1 rounded-full" />
    </div>
  );
}

/* ── Horizontal compact card skeleton ──────────────────────── */
function CompactCardSkeleton() {
  return (
    <div className="flex items-start gap-3 border-b border-border py-3">
      <Shimmer className="h-[72px] w-[100px] shrink-0 rounded-lg" />
      <div className="flex-1 flex flex-col gap-2 pt-1">
        <Shimmer className="h-3 w-14 rounded-full" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-3 w-20 mt-1 rounded-full" />
      </div>
    </div>
  );
}

/* ── Section heading skeleton ───────────────────────────────── */
function SectionHeadingSkeleton() {
  return (
    <div className="flex items-center gap-3 mb-5 border-b border-border pb-3">
      <Shimmer className="h-7 w-28 rounded" />
      <Shimmer className="h-px flex-1" />
      <Shimmer className="h-4 w-20 rounded-full" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   HOME PAGE SKELETON
   ════════════════════════════════════════════════════════════ */
export function HomePageSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 animate-pulse">
      {/* Hero row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-10">
        {/* Main hero card */}
        <Shimmer className="aspect-[16/9] w-full rounded-xl" />
        {/* Side stack */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <CompactCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Section 1 */}
      <SectionHeadingSkeleton />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
      </div>

      {/* Section 2 */}
      <SectionHeadingSkeleton />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
        {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>

      {/* Section 3 */}
      <SectionHeadingSkeleton />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ARTICLE DETAIL SKELETON
   ════════════════════════════════════════════════════════════ */
export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        {/* Main article */}
        <div className="min-w-0">
          {/* Breadcrumb */}
          <div className="flex gap-2 mb-4">
            <Shimmer className="h-3 w-16 rounded-full" />
            <Shimmer className="h-3 w-3 rounded-full" />
            <Shimmer className="h-3 w-24 rounded-full" />
          </div>
          {/* Category badge */}
          <Shimmer className="h-5 w-20 rounded-full mb-3" />
          {/* Title */}
          <Shimmer className="h-8 w-full mb-2" />
          <Shimmer className="h-8 w-5/6 mb-2" />
          <Shimmer className="h-8 w-4/6 mb-5" />
          {/* Subtitle */}
          <Shimmer className="h-5 w-full mb-2" />
          <Shimmer className="h-5 w-3/4 mb-6" />
          {/* Byline */}
          <div className="flex items-center gap-3 py-4 border-y border-border mb-6">
            <Shimmer className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Shimmer className="h-4 w-28" />
              <Shimmer className="h-3 w-36 rounded-full" />
            </div>
          </div>
          {/* Hero image */}
          <Shimmer className="aspect-[16/9] w-full rounded-xl mb-6" />
          {/* Body paragraphs */}
          {[100, 90, 95, 80, 100, 88, 75].map((w, i) => (
            <Shimmer key={i} className={`h-4 w-[${w}%] mb-3`} />
          ))}
          <Shimmer className="h-4 w-2/3 mb-6" />
          {/* Gist block */}
          <div className="border-l-4 border-accent pl-5 mb-6">
            <Shimmer className="h-5 w-40 mb-3" />
            {[1, 2, 3].map((i) => (
              <Shimmer key={i} className="h-4 w-11/12 mb-2" />
            ))}
          </div>
          {/* More body */}
          {[92, 85, 100, 78].map((w, i) => (
            <Shimmer key={i} className="h-4 w-full mb-3" />
          ))}
        </div>
        {/* Sidebar */}
        <div className="flex flex-col gap-6 sticky top-20">
          <div>
            <SectionHeadingSkeleton />
            {[1, 2, 3, 4].map((i) => <CompactCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SEARCH PAGE SKELETON
   ════════════════════════════════════════════════════════════ */
export function SearchPageSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 animate-pulse">
      {/* Header */}
      <Shimmer className="h-3 w-40 rounded-full mb-3" />
      <Shimmer className="h-10 w-72 mb-6" />
      {/* Search bar */}
      <Shimmer className="h-14 w-full max-w-3xl rounded-xl mb-10" />
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6 border-b border-border pb-3">
        <Shimmer className="h-5 w-28" />
        <Shimmer className="h-3 w-20 rounded-full" />
      </div>
      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CATEGORY PAGE SKELETON
   ════════════════════════════════════════════════════════════ */
export function CategoryPageSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 animate-pulse">
      {/* Category header */}
      <Shimmer className="h-8 w-48 mb-2" />
      <Shimmer className="h-4 w-64 mb-8 rounded-full" />
      {/* Filter pills */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Shimmer key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      {/* Cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   VIDEOS PAGE SKELETON
   ════════════════════════════════════════════════════════════ */
export function VideosPageSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 animate-pulse">
      {/* Channel Header Banner Skeleton */}
      <Shimmer className="w-full aspect-[4/1] md:aspect-[6/1] rounded-2xl mb-8" />
      
      {/* Main Grid: Body + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mb-10">
        <div className="flex flex-col gap-6">
          <SectionHeadingSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <SectionHeadingSkeleton />
          {[1, 2, 3, 4].map((i) => <CompactCardSkeleton key={i} />)}
        </div>
      </div>

      {/* Shorts Section Heading */}
      <SectionHeadingSkeleton />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Shimmer className="aspect-[9/16] w-full rounded-2xl" />
            <Shimmer className="h-4 w-5/6" />
            <Shimmer className="h-3 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
