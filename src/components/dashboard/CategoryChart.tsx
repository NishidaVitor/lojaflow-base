import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'
import { categoryData } from '@/data/mock'

interface TooltipProps {
  active?: boolean
  payload?: { name: string; value: number; payload: { color: string } }[]
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1C26] border border-[#2A2A3A] rounded-xl px-3 py-2 shadow-xl">
        <p className="text-xs text-white/50 mb-0.5">{payload[0].name}</p>
        <p className="text-sm font-semibold text-white">{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export function CategoryChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
      className="rounded-2xl border border-[#2A2A3A] bg-[#16161D] p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">Vendas por Categoria</h3>
        <p className="text-xs text-white/40 mt-0.5">Distribuição percentual</p>
      </div>

      <div className="flex items-center gap-4">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex-1 space-y-2.5">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-white/60">{item.name}</span>
              </div>
              <span className="text-xs font-medium text-white/80">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
