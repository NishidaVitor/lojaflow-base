import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { salesData } from '@/data/mock'

interface TooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1C26] border border-[#2A2A3A] rounded-xl px-3 py-2 shadow-xl">
        <p className="text-xs text-white/50 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-white">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
            payload[0].value
          )}
        </p>
      </div>
    )
  }
  return null
}

export function SalesChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
      className="rounded-2xl border border-[#2A2A3A] bg-[#16161D] p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">Vendas — últimos 7 dias</h3>
        <p className="text-xs text-white/40 mt-0.5">Receita diária em reais</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={salesData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#6B7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2A2A3A' }} />
          <Line
            type="monotone"
            dataKey="vendas"
            stroke="#4F46E5"
            strokeWidth={2.5}
            dot={{ fill: '#4F46E5', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#4F46E5', stroke: '#16161D', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
