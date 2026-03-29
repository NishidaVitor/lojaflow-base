import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

export interface TotalizadorItem {
  label: string
  value: string
  sublabel?: string
  color: 'indigo' | 'violet' | 'cyan' | 'emerald' | 'red' | 'amber'
  icon: LucideIcon
}

const colorMap: Record<
  TotalizadorItem['color'],
  { bg: string; text: string; icon: string }
> = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', icon: 'text-indigo-400' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', icon: 'text-violet-400' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', icon: 'text-cyan-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: 'text-emerald-400' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', icon: 'text-red-400' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: 'text-amber-400' },
}

interface Props {
  items: TotalizadorItem[]
}

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
}
const cardVariant = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export function TotalizadoresRelatorio({ items }: Props) {
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {items.map((item, i) => {
        const colors = colorMap[item.color]
        const Icon = item.icon
        return (
          <motion.div
            key={i}
            variants={cardVariant}
            className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/20 rounded-xl p-4 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className={colors.icon} />
              </div>
              <span className="text-xs text-white/40 truncate">{item.label}</span>
            </div>
            <p className={`text-xl font-bold ${colors.text} leading-none`}>{item.value}</p>
            {item.sublabel && (
              <p className="text-xs text-white/30 mt-1 truncate">{item.sublabel}</p>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
