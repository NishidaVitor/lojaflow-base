import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EstoqueCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  iconBg: string
  iconColor: string
  delay?: number
}

export function EstoqueCard({ title, value, icon: Icon, iconBg, iconColor, delay = 0 }: EstoqueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4 hover:border-indigo-500/30 transition-colors cursor-default"
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <p className="text-xs text-white/40 font-medium mb-0.5">{title}</p>
        <p className="text-lg font-semibold text-white leading-tight">{value}</p>
      </div>
    </motion.div>
  )
}
