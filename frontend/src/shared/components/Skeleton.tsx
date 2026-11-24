interface SkeletonProps {
  cantidad?: number
  className?: string
}

const Skeleton = ({ cantidad = 4, className = "h-16" }: SkeletonProps) => (
  <div aria-busy="true" className="contents">
    {Array.from({ length: cantidad }, (_, i) => (
      <div key={i} className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />
    ))}
  </div>
)

export default Skeleton
