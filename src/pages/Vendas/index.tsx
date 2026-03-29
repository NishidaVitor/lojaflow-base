import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { vendasStore } from '@/store/vendasStore'
import { VendaTotalizadores } from '@/components/vendas/VendaTotalizadores'
import { VendaTabela } from '@/components/vendas/VendaTabela'

export function VendasListView() {
  const navigate = useNavigate()
  const vendas = [...vendasStore.values()]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-bold text-white">Vendas</h1>
          <p className="text-sm text-white/40 mt-0.5">Gerencie pedidos e acompanhe o ciclo de vida das vendas</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/vendas/nova')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shrink-0"
        >
          <Plus size={15} />
          Nova Venda
        </motion.button>
      </motion.div>

      {/* Totalizadores */}
      <VendaTotalizadores vendas={vendas} />

      {/* Tabela */}
      <VendaTabela vendas={vendas} />
    </div>
  )
}
