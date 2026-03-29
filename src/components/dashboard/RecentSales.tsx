import { motion } from 'framer-motion'
import { recentSales } from '@/data/mock'
import { Badge } from '@/components/ui/Badge'

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  concluído: { label: 'Concluído', variant: 'success' },
  pendente: { label: 'Pendente', variant: 'warning' },
  cancelado: { label: 'Cancelado', variant: 'danger' },
}

export function RecentSales() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
      className="rounded-2xl border border-[#2A2A3A] bg-[#16161D] p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">Últimas Vendas</h3>
        <p className="text-xs text-white/40 mt-0.5">5 transações mais recentes</p>
      </div>

      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 px-3 py-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest border-b border-[#2A2A3A] mb-1">
        <span>ID</span>
        <span>Produto / Cliente</span>
        <span className="text-right">Valor</span>
        <span className="text-right">Status</span>
        <span className="text-right">Hora</span>
      </div>

      <div className="space-y-0.5">
        {recentSales.map((sale, i) => (
          <motion.div
            key={sale.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.35 + i * 0.05, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto] gap-1 sm:gap-3 px-3 py-3 rounded-xl hover:bg-white/3 transition-colors cursor-default group"
          >
            {/* ID */}
            <span className="text-xs font-mono text-white/30 group-hover:text-white/50 transition-colors self-center">
              {sale.id}
            </span>

            {/* Product + Client */}
            <div className="sm:self-center">
              <p className="text-sm font-medium text-white/80">{sale.produto}</p>
              <p className="text-xs text-white/40">{sale.cliente}</p>
            </div>

            {/* Value */}
            <span className="text-sm font-semibold text-accent self-center sm:text-right">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                sale.valor
              )}
            </span>

            {/* Status */}
            <div className="self-center sm:text-right">
              <Badge variant={statusMap[sale.status].variant}>
                {statusMap[sale.status].label}
              </Badge>
            </div>

            {/* Date */}
            <span className="text-xs text-white/30 self-center sm:text-right">{sale.data}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
