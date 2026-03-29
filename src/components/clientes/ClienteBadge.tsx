import { cn } from '@/lib/utils'

interface ClienteBadgeProps {
  status: 'ativo' | 'inativo'
  className?: string
}

export function ClienteBadge({ status, className }: ClienteBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        status === 'ativo'
          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          : 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'ativo' ? 'bg-emerald-400' : 'bg-gray-500'
        )}
      />
      {status === 'ativo' ? 'Ativo' : 'Inativo'}
    </span>
  )
}
