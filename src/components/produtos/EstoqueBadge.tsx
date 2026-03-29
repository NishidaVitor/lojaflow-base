import { cn } from '@/lib/utils'
import type { StatusEstoque } from '@/types/produto'

interface EstoqueBadgeProps {
  status: StatusEstoque
  value?: number
  className?: string
}

const statusConfig: Record<StatusEstoque, { label: string; classes: string }> = {
  normal:  { label: 'Normal',  classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  baixo:   { label: 'Baixo',   classes: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  critico: { label: 'Crítico', classes: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  zerado:  { label: 'Zerado',  classes: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

export function EstoqueBadge({ status, value, className }: EstoqueBadgeProps) {
  const { label, classes } = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        classes,
        className
      )}
    >
      {value !== undefined && <span className="font-semibold">{value}</span>}
      {label}
    </span>
  )
}
