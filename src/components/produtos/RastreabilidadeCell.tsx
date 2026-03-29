import { useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Truck,
  ClipboardEdit,
  RotateCcw,
  AlertOctagon,
} from 'lucide-react'
import type { MovimentacaoEstoque } from '@/types/produto'
import { cn } from '@/lib/utils'

interface RastreabilidadeCellProps {
  mov: MovimentacaoEstoque
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + '…' : str
}

export function RastreabilidadeCell({ mov }: RastreabilidadeCellProps) {
  const navigate = useNavigate()

  if (mov.referencia_tipo === 'venda') {
    return (
      <div className="flex items-start gap-2">
        <ShoppingBag size={13} className="text-indigo-400 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <button
            onClick={() => navigate(`/vendas/${mov.referencia_id}`)}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors hover:underline underline-offset-2"
          >
            {mov.referencia_numero}
          </button>
          {mov.cliente_nome && (
            <p className="text-xs text-white/40 truncate">{mov.cliente_nome}</p>
          )}
        </div>
      </div>
    )
  }

  if (mov.referencia_tipo === 'compra') {
    return (
      <div className="flex items-start gap-2">
        <Truck size={13} className="text-blue-400 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <button
            onClick={() => navigate(`/compras/${mov.referencia_id}`)}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors hover:underline underline-offset-2"
          >
            {mov.referencia_numero}
          </button>
          {mov.fornecedor_nome && (
            <p className="text-xs text-white/40 truncate">{truncate(mov.fornecedor_nome, 22)}</p>
          )}
        </div>
      </div>
    )
  }

  if (mov.referencia_tipo === 'ajuste') {
    return (
      <div className="flex items-start gap-2">
        <ClipboardEdit size={13} className="text-orange-400 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-white/60">Ajuste Manual</p>
          <p className="text-xs text-white/40 truncate">{truncate(mov.motivo, 35)}</p>
        </div>
      </div>
    )
  }

  if (mov.referencia_tipo === 'devolucao') {
    return (
      <div className="flex items-start gap-2">
        <RotateCcw size={13} className="text-yellow-400 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-yellow-400">Devolução</span>
            {mov.referencia_numero && (
              <button
                onClick={() => navigate(`/vendas/${mov.referencia_id}`)}
                className="text-xs text-yellow-400/70 hover:text-yellow-300 transition-colors hover:underline"
              >
                {mov.referencia_numero}
              </button>
            )}
          </div>
          {mov.cliente_nome && (
            <p className="text-xs text-white/40 truncate">{mov.cliente_nome}</p>
          )}
        </div>
      </div>
    )
  }

  if (mov.referencia_tipo === 'perda') {
    return (
      <div className="flex items-start gap-2">
        <AlertOctagon size={13} className="text-red-400 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-red-400">Perda Registrada</p>
          <p className="text-xs text-white/40 truncate">{truncate(mov.motivo, 35)}</p>
        </div>
      </div>
    )
  }

  return (
    <span className={cn('text-xs text-white/25 italic')}>—</span>
  )
}
