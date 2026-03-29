import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Users } from 'lucide-react'
import { clientesMock } from '@/mocks/clientes'
import { ClienteTabela } from '@/components/clientes/ClienteTabela'
import { cn } from '@/lib/utils'

type FiltroStatus = 'todos' | 'ativo' | 'inativo'

export function ClientesListView() {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<FiltroStatus>('todos')

  const clientesFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim()
    return clientesMock.filter((c) => {
      const matchBusca =
        !termo ||
        c.nome.toLowerCase().includes(termo) ||
        c.telefone.includes(termo) ||
        c.email.toLowerCase().includes(termo)
      const matchStatus = filtro === 'todos' || c.status === filtro
      return matchBusca && matchStatus
    })
  }, [busca, filtro])

  const filtros: { label: string; value: FiltroStatus }[] = [
    { label: 'Todos', value: 'todos' },
    { label: 'Ativos', value: 'ativo' },
    { label: 'Inativos', value: 'inativo' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-700 text-white flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Clientes
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {clientesMock.length} clientes cadastrados
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shrink-0"
        >
          <Plus size={15} />
          Novo Cliente
        </motion.button>
      </motion.div>

      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, telefone ou e-mail…"
            className="w-full bg-white/5 border border-white/10 text-white/80 placeholder:text-white/25 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all"
            aria-label="Buscar clientes"
          />
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 self-start">
          {filtros.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filtro === f.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
      >
        <ClienteTabela clientes={clientesFiltrados} />
      </motion.div>

      {/* Count footer */}
      {clientesFiltrados.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-white/30 text-center pb-2"
        >
          Exibindo {clientesFiltrados.length} de {clientesMock.length} clientes
        </motion.p>
      )}
    </div>
  )
}
