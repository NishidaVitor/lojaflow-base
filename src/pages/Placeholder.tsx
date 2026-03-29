import { motion } from 'framer-motion'

interface PlaceholderProps {
  title: string
  icon: string
}

export function Placeholder({ title, icon }: PlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <span className="text-5xl mb-4" role="img" aria-label={title}>
        {icon}
      </span>
      <h1 className="text-2xl font-700 text-white">{title}</h1>
      <p className="text-white/40 text-sm mt-2">Esta seção está em construção.</p>
    </motion.div>
  )
}
