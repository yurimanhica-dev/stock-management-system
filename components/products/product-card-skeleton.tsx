function ProductCardSkeleton() {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card animate-pulse">
      <div className="w-full h-48 bg-muted" />

      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>

        <div className="h-5 bg-muted rounded w-1/3" />

        <div className="flex justify-between">
          <div className="space-y-1">
            <div className="h-3 bg-muted rounded w-10" />
            <div className="h-5 bg-muted rounded w-16" />
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-muted rounded w-10" />
            <div className="h-5 bg-muted rounded w-8" />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-muted rounded w-full" />
          <div className="h-8 bg-muted rounded w-10" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
