import { motion } from 'framer-motion'

interface Props {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  delay?: number
}

export function GraficoRelatorio({ title, children, actions, delay = 0.3 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-white/70">{title}</p>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="h-[300px]">{children}</div>
    </motion.div>
  )
}

// ─── Custom Tooltip compartilhado ────────────────────────────────────────────

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color?: string; fill?: string }>
  label?: string
  formatValue?: (name: string, value: number) => string
}

export function CustomTooltip({ active, payload, label, formatValue }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm shadow-xl">
      {label && <p className="text-white/50 text-xs mb-1.5">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color || entry.fill || '#fff' }}>
          <span className="text-white/60">{entry.name}: </span>
          {formatValue ? formatValue(entry.name, entry.value) : entry.value}
        </p>
      ))}
    </div>
  )
}

// ─── Constantes de cores compartilhadas ──────────────────────────────────────

export const CHART_COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']

export const AXIS_PROPS = {
  tick: { fill: '#9CA3AF', fontSize: 11 },
  axisLine: { stroke: '#ffffff15' },
  tickLine: false,
}

export const GRID_PROPS = {
  strokeDasharray: '3 3',
  stroke: '#ffffff15',
  vertical: false,
}
