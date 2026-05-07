function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-64 bg-muted rounded-md" />
        <div className="h-4 w-40 bg-muted rounded-md mt-3" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-border bg-muted/40 p-6"
          >
            <div className="h-3 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Charts row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line chart skeleton */}
        <div className="lg:col-span-2 h-[320px] rounded-xl border border-border bg-muted/40 p-6">
          <div className="h-4 w-40 bg-muted rounded mb-6" />
          <div className="h-full w-full bg-muted/30 rounded-lg" />
        </div>

        {/* Pie chart skeleton */}
        <div className="h-[320px] rounded-xl border border-border bg-muted/40 p-6">
          <div className="h-4 w-32 bg-muted rounded mb-6" />
          <div className="h-full w-full bg-muted/30 rounded-full" />
        </div>
      </div>

      {/* Bar chart skeleton */}
      <div className="h-[320px] rounded-xl border border-border bg-muted/40 p-6">
        <div className="h-4 w-48 bg-muted rounded mb-6" />
        <div className="h-full w-full bg-muted/30 rounded-lg" />
      </div>
    </div>
  );
}

export default DashboardSkeleton;
