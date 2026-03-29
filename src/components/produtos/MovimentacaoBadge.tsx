import { cn } from '@/lib/utils'
import type { MovimentacaoEstoque } from '@/types/produto'

interface MovimentacaoBadgeProps {
  tipo: MovimentacaoEstoque['tipo']
  className?: string
}

const tipoConfig: Record<MovimentacaoEstoque['tipo'], { label: string; classes: string }> = {
  compra:             { label: 'Compra',            classes: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  venda:              { label: 'Venda',             classes: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  ajuste_positivo:    { label: 'Ajuste +',          classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  ajuste_negativo:    { label: 'Ajuste −',          classes: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  devolucao_cliente:  { label: 'Devolução',         classes: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  perda:              { label: 'Perda',             classes: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

export function MovimentacaoBadge({ tipo, className }: MovimentacaoBadgeProps) {
  const { label, classes } = tipoConfig[tipo]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap',
        classes,
        className
      )}
    >
      {label}
    </span>
  )
}
