export function ProductFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-48 bg-border rounded" />

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-border rounded" />
          <div className="h-10 bg-border rounded" />
          <div className="h-10 bg-border rounded" />
          <div className="h-10 bg-border rounded" />
        </div>

        <div className="h-32 bg-border rounded" />

        <div className="h-32 bg-border rounded" />

        <div className="flex gap-4">
          <div className="h-10 w-32 bg-border rounded" />
          <div className="h-10 w-32 bg-border rounded" />
        </div>
      </div>
    </div>
  );
}
