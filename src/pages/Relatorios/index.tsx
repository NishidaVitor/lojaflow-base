import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  MenuRelatorios,
  MENU_GRUPOS,
  type RelatorioId,
} from '@/components/relatorios/MenuRelatorios'
import { FaturamentoPeriodo } from '@/components/relatorios/relatorios/FaturamentoPeriodo'
import { VendasFormaPagamento } from '@/components/relatorios/relatorios/VendasFormaPagamento'
import { VendasCliente } from '@/components/relatorios/relatorios/VendasCliente'
import { ProdutosMaisVendidos } from '@/components/relatorios/relatorios/ProdutosMaisVendidos'
import { PosicaoEstoque } from '@/components/relatorios/relatorios/PosicaoEstoque'
import { ProdutosAbaixoMinimo } from '@/components/relatorios/relatorios/ProdutosAbaixoMinimo'
import { MovimentacoesPeriodo } from '@/components/relatorios/relatorios/MovimentacoesPeriodo'
import { ClientesPorStatus } from '@/components/relatorios/relatorios/ClientesPorStatus'
import { RankingClientes } from '@/components/relatorios/relatorios/RankingClientes'

const RELATORIO_COMPONENTS: Record<RelatorioId, React.ComponentType> = {
  faturamento_periodo: FaturamentoPeriodo,
  vendas_pagamento: VendasFormaPagamento,
  vendas_cliente: VendasCliente,
  produtos_vendidos: ProdutosMaisVendidos,
  posicao_estoque: PosicaoEstoque,
  abaixo_minimo: ProdutosAbaixoMinimo,
  movimentacoes: MovimentacoesPeriodo,
  clientes_status: ClientesPorStatus,
  ranking_clientes: RankingClientes,
}

// Flat list for mobile select
const ALL_ITEMS = MENU_GRUPOS.flatMap((g) =>
  g.items.map((item) => ({ ...item, grupo: g.grupo }))
)

export function Relatorios() {
  const [ativo, setAtivo] = useState<RelatorioId>('faturamento_periodo')

  const ActiveComponent = RELATORIO_COMPONENTS[ativo]

  return (
    <div className="flex gap-0 min-h-[calc(100vh-4rem)] -mx-4 sm:-mx-6">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-[280px] flex-shrink-0 bg-white/[0.02] border-r border-white/5">
        <MenuRelatorios ativo={ativo} onChange={setAtivo} />
      </aside>

      {/* ── Content area ── */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 py-5 overflow-y-auto">
        {/* Mobile: select dropdown */}
        <div className="md:hidden mb-5">
          <label className="text-xs text-white/40 block mb-1.5">Relatório</label>
          <select
            value={ativo}
            onChange={(e) => setAtivo(e.target.value as RelatorioId)}
            className="w-full bg-[#1C1C26] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500/50 appearance-none"
          >
            {MENU_GRUPOS.map((grupo) => (
              <optgroup key={grupo.grupo} label={grupo.grupo}>
                {grupo.items.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Report content with enter/exit animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={ativo}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
