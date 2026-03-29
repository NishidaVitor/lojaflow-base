import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import type { Cliente } from '@/types/cliente'
import { ClienteBadge } from './ClienteBadge'
import { cn } from '@/lib/utils'

interface ClienteTabelaProps {
  clientes: Cliente[]
}

const AVATAR_COLORS = [
  'bg-indigo-500/30 text-indigo-300',
  'bg-violet-500/30 text-violet-300',
  'bg-cyan-500/30 text-cyan-300',
  'bg-emerald-500/30 text-emerald-300',
  'bg-amber-500/30 text-amber-300',
  'bg-pink-500/30 text-pink-300',
]

function Avatar({ nome, index }: { nome: string; index: number }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length]
  return (
    <div
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0',
        color
      )}
      aria-hidden="true"
    >
      {nome.charAt(0).toUpperCase()}
    </div>
  )
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.05 } },
}

const rowVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

export function ClienteTabela({ clientes }: ClienteTabelaProps) {
  const navigate = useNavigate()

  if (clientes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Users size={24} className="text-white/25" />
        </div>
        <p className="text-white/50 font-medium">Nenhum cliente encontrado</p>
        <p className="text-white/25 text-sm mt-1">Tente ajustar os filtros ou adicione um novo cliente.</p>
      </motion.div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-3 border-b border-white/8 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
        <span>Cliente</span>
        <span>Telefone</span>
        <span>E-mail</span>
        <span>Cidade</span>
        <span className="text-right">Total Gasto</span>
        <span className="text-center">Status</span>
        <span className="text-right">Última Compra</span>
      </div>

      {/* Rows */}
      <motion.div variants={containerVariants} initial="initial" animate="animate">
        {clientes.map((cliente, i) => (
          <motion.div
            key={cliente.id}
            variants={rowVariants}
            onClick={() => navigate(`/clientes/${cliente.id}`)}
            className="group relative grid grid-cols-1 md:grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1fr_1fr] gap-2 md:gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/4 transition-colors"
          >
            {/* Hover indicator */}
            <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Nome */}
            <div className="flex items-center gap-3">
              <Avatar nome={cliente.nome} index={i} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white/90 truncate">{cliente.nome}</p>
                <p className="text-xs text-white/40 md:hidden truncate">{cliente.email}</p>
              </div>
            </div>

            {/* Telefone */}
            <div className="hidden md:flex items-center">
              <span className="text-sm text-white/60">{cliente.telefone}</span>
            </div>

            {/* Email */}
            <div className="hidden md:flex items-center">
              <span className="text-sm text-white/60 truncate">{cliente.email}</span>
            </div>

            {/* Cidade */}
            <div className="hidden md:flex items-center">
              <span className="text-sm text-white/60">{cliente.cidade}</span>
            </div>

            {/* Total Gasto */}
            <div className="hidden md:flex items-center justify-end">
              <span className="text-sm font-semibold text-cyan-400">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  cliente.totalCompras
                )}
              </span>
            </div>

            {/* Status */}
            <div className="hidden md:flex items-center justify-center">
              <ClienteBadge status={cliente.status} />
            </div>

            {/* Última Compra */}
            <div className="hidden md:flex items-center justify-end">
              <span className="text-sm text-white/40">{cliente.ultimaCompra}</span>
            </div>

            {/* Mobile: secondary info row */}
            <div className="flex md:hidden items-center justify-between gap-2 -mt-1">
              <ClienteBadge status={cliente.status} />
              <span className="text-xs font-semibold text-cyan-400">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  cliente.totalCompras
                )}
              </span>
              <span className="text-xs text-white/40">{cliente.ultimaCompra}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
