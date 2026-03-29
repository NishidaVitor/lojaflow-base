import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { RecentSales } from '@/components/dashboard/RecentSales'
import { metrics } from '@/data/mock'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function getFormattedDate() {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

const metricIcons = [DollarSign, ShoppingBag, Package, Users]
const metricKeys = ['vendasHoje', 'pedidosDia', 'estoque', 'clientesAtivos'] as const
const metricTitles = ['Vendas Hoje', 'Pedidos do Dia', 'Estoque', 'Clientes Ativos']

export function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <h1 className="text-xl font-700 text-white">
          {getGreeting()}, Vitor 👋
        </h1>
        <p className="text-sm text-white/40 mt-0.5 capitalize">{getFormattedDate()}</p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricKeys.map((key, i) => (
          <MetricCard
            key={key}
            title={metricTitles[i]}
            icon={metricIcons[i]}
            delay={i * 0.05}
            {...metrics[key]}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <CategoryChart />
        </div>
      </div>

      {/* Recent Sales */}
      <RecentSales />
    </div>
  )
}
