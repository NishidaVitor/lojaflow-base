export function SkeletonRelatorio() {
  return (
    <div className="space-y-4">
      {/* Totalizadores skeleton */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-white/10" />
              <div className="h-2.5 bg-white/10 rounded w-2/3" />
            </div>
            <div className="h-7 bg-white/10 rounded w-1/2 mb-1.5" />
            <div className="h-2 bg-white/[0.07] rounded w-3/4" />
          </div>
        ))}
      </div>

      {/* Gráfico skeleton */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse">
        <div className="h-3 bg-white/10 rounded w-1/4 mb-5" />
        <div className="h-[300px] bg-white/[0.06] rounded-lg" />
      </div>

      {/* Tabela skeleton */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse">
        <div className="h-3 bg-white/10 rounded w-1/4 mb-5" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-white/[0.06] rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
