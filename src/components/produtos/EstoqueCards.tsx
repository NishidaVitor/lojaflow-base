import { motion } from 'framer-motion'
import { Warehouse, Clock, Package, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EstoqueProduto, StatusEstoque } from '@/types/produto'

interface EstoqueCardsProps {
  estoque: EstoqueProduto
  status: StatusEstoque
}

const statusValueColor: Record<StatusEstoque, string> = {
  normal:  'text-emerald-400',
  baixo:   'text-yellow-400',
  critico: 'text-orange-400',
  zerado:  'text-red-400',
}

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

interface CardProps {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  label: string
  value: number
  subtitle: string
  valueColor?: string
  alertBorder?: boolean
}

function Card({ icon: Icon, iconBg, iconColor, label, value, subtitle, valueColor, alertBorder }: CardProps) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'flex items-center gap-4 rounded-xl border bg-white/5 backdrop-blur-sm px-5 py-4 hover:border-indigo-500/30 transition-colors cursor-default',
        alertBorder ? 'border-yellow-500/40' : 'border-white/10'
      )}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-white/40 font-medium mb-0.5">{label}</p>
        <p className={cn('text-2xl font-bold leading-tight', valueColor ?? 'text-white')}>
          {value}
        </p>
        <p className="text-xs text-white/30 mt-0.5 truncate">{subtitle}</p>
      </div>
    </motion.div>
  )
}

export function EstoqueCards({ estoque, status }: EstoqueCardsProps) {
  const abaixoMinimo = estoque.estoque_atual <= estoque.estoque_minimo

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <Card
        icon={Warehouse}
        iconBg="bg-cyan-500/10"
        iconColor="text-cyan-400"
        label="Estoque Real"
        value={estoque.estoque_real}
        subtitle="Total físico no estoque"
      />
      <Card
        icon={Clock}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-400"
        label="Reservado"
        value={estoque.estoque_reservado}
        subtitle="Separado para pedidos"
        valueColor={estoque.estoque_reservado === 0 ? 'text-white/30' : undefined}
      />
      <Card
        icon={Package}
        iconBg={
          status === 'normal'  ? 'bg-emerald-500/10' :
          status === 'baixo'   ? 'bg-yellow-500/10'  :
          status === 'critico' ? 'bg-orange-500/10'  :
          'bg-red-500/10'
        }
        iconColor={statusValueColor[status]}
        label="Disponível para Venda"
        value={estoque.estoque_atual}
        subtitle="Real − Reservado"
        valueColor={statusValueColor[status]}
      />
      <Card
        icon={AlertTriangle}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-400"
        label="Estoque Mínimo"
        value={estoque.estoque_minimo}
        subtitle="Nível de alerta configurado"
        alertBorder={abaixoMinimo}
      />
    </motion.div>
  )
}
