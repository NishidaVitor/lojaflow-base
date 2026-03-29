import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ClienteCardProps {
  title: string
  value: string
  icon: React.ElementType
  iconColor?: string
  delay?: number
}

export function ClienteCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  delay = 0,
}: ClienteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4 hover:border-indigo-500/30 transition-colors cursor-default"
    >
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5',
          iconColor === 'text-accent' ? 'bg-cyan-500/10' : 'bg-indigo-500/10'
        )}
      >
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <p className="text-xs text-white/40 font-medium mb-0.5">{title}</p>
        <p className="text-lg font-600 text-white leading-tight">{value}</p>
      </div>
    </motion.div>
  )
}
