import { cn } from '@/lib/utils'
import type { StatusVenda } from '@/types/venda'

const config: Record<StatusVenda, { label: string; className: string }> = {
  orcamento:    { label: 'Orçamento',    className: 'bg-white/10 text-white/50 border-white/20' },
  confirmada:   { label: 'Confirmada',   className: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  em_separacao: { label: 'Em Separação', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  entregue:     { label: 'Entregue',     className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  cancelada:    { label: 'Cancelada',    className: 'bg-red-500/15 text-red-300 border-red-500/30' },
  devolvida:    { label: 'Devolvida',    className: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
}

interface Props {
  status: StatusVenda
  size?: 'sm' | 'md'
}

export function VendaStatusBadge({ status, size = 'sm' }: Props) {
  const { label, className } = config[status]
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        className
      )}
    >
      {label}
    </span>
  )
}
