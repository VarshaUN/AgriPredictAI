const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`rounded-card bg-card p-6 shadow-card ${className}`}>
    <div className="space-y-3">
      <div className="h-4 w-1/3 rounded animate-shimmer" />
      <div className="h-8 w-2/3 rounded animate-shimmer" />
      <div className="h-3 w-full rounded animate-shimmer" />
    </div>
  </div>
);

export default SkeletonCard;
