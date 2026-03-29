import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  valor: string
  variacao: string
  positivo: boolean
  subtitulo: string
  icon: React.ElementType
  delay?: number
}

export function MetricCard({
  title,
  valor,
  variacao,
  positivo,
  subtitulo,
  icon: Icon,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className="relative rounded-2xl border border-[#2A2A3A] bg-[#16161D] p-5 overflow-hidden cursor-default group"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-700 text-white tracking-tight mt-2">{valor}</p>
          <p className="text-xs text-white/40 mt-1">{subtitulo}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {positivo ? (
          <TrendingUp size={13} className="text-emerald-400" />
        ) : (
          <TrendingDown size={13} className="text-amber-400" />
        )}
        <span
          className={cn(
            'text-xs font-medium',
            positivo ? 'text-emerald-400' : 'text-amber-400'
          )}
        >
          {variacao}
        </span>
      </div>
    </motion.div>
  )
}
