import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpCircle, ArrowDownCircle, History, Plus, ArrowRight, X } from 'lucide-react'
import type { MovimentacaoEstoque } from '@/types/produto'
import { MovimentacaoBadge } from './MovimentacaoBadge'
import { RastreabilidadeCell } from './RastreabilidadeCell'
import { cn } from '@/lib/utils'

interface MovimentacaoTabelaProps {
  movimentacoes: MovimentacaoEstoque[]
  onNovaMovimentacao: () => void
}

type FiltroOp = 'todos' | 'entrada' | 'saida'
type FiltroOrigem = 'todos' | 'venda' | 'compra' | 'ajuste' | 'devolucao' | 'perda'

const PAGE_SIZE = 10

const origemOptions: { label: string; value: FiltroOrigem }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Vendas', value: 'venda' },
  { label: 'Compras', value: 'compra' },
  { label: 'Ajustes', value: 'ajuste' },
  { label: 'Devoluções', value: 'devolucao' },
  { label: 'Perdas', value: 'perda' },
]

const opOptions: { label: string; value: FiltroOp }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Entradas', value: 'entrada' },
  { label: 'Saídas', value: 'saida' },
]

function AvatarUser({ nome }: { nome: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-semibold shrink-0">
        {nome.charAt(0).toUpperCase()}
      </div>
      <span className="text-xs text-white/40 truncate hidden xl:block">{nome}</span>
    </div>
  )
}

export function MovimentacaoTabela({ movimentacoes, onNovaMovimentacao }: MovimentacaoTabelaProps) {
  const [filtroOp, setFiltroOp] = useState<FiltroOp>('todos')
  const [filtroOrigem, setFiltroOrigem] = useState<FiltroOrigem>('todos')
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)

  const filtradas = useMemo(() => {
    const termo = busca.toLowerCase().trim()
    return [...movimentacoes]
      .sort((a, b) => {
        // Sort by date desc — parse dd/mm/yyyy hh:mm
        const parse = (s: string) => {
          const [d, t = '00:00'] = s.split(' ')
          const [day, mon, yr] = d.split('/')
          return new Date(`${yr}-${mon}-${day}T${t}`).getTime()
        }
        return parse(b.criado_em) - parse(a.criado_em)
      })
      .filter((m) => {
        const matchOp = filtroOp === 'todos' || m.operacao === filtroOp
        const matchOrigem = filtroOrigem === 'todos' || m.referencia_tipo === filtroOrigem
        const matchBusca =
          !termo ||
          (m.referencia_numero?.toLowerCase().includes(termo) ?? false) ||
          (m.cliente_nome?.toLowerCase().includes(termo) ?? false) ||
          (m.fornecedor_nome?.toLowerCase().includes(termo) ?? false) ||
          m.motivo.toLowerCase().includes(termo)
        return matchOp && matchOrigem && matchBusca
      })
  }, [movimentacoes, filtroOp, filtroOrigem, busca])

  const visiveis = filtradas.slice(0, pagina * PAGE_SIZE)
  const temMais = visiveis.length < filtradas.length

  function resetFiltros() {
    setFiltroOp('todos')
    setFiltroOrigem('todos')
    setBusca('')
    setPagina(1)
  }

  const temFiltroAtivo = filtroOp !== 'todos' || filtroOrigem !== 'todos' || busca !== ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
      className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <History size={16} className="text-white/40" />
          <div>
            <h2 className="text-sm font-semibold text-white">Movimentações de Estoque</h2>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
            {movimentacoes.length}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNovaMovimentacao}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10 transition-colors shrink-0"
        >
          <Plus size={13} />
          Movimentação
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        {/* Op tabs */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 self-start">
          {opOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => { setFiltroOp(o.value); setPagina(1) }}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                filtroOp === o.value ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white/70'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Origem tabs */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 self-start flex-wrap">
          {origemOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => { setFiltroOrigem(o.value); setPagina(1) }}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                filtroOrigem === o.value ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white/70'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPagina(1) }}
          placeholder="Buscar por ref., cliente…"
          className="bg-white/5 border border-white/10 text-white/70 placeholder:text-white/20 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500/50 transition-all min-w-40"
        />

        {temFiltroAtivo && (
          <button
            onClick={resetFiltros}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/40 hover:text-white/70 border border-white/10 self-start transition-all"
          >
            <X size={11} /> Limpar
          </button>
        )}
      </div>

      {/* Empty state */}
      {filtradas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <History size={28} className="text-white/15 mb-3" />
          <p className="text-sm text-white/40">Nenhuma movimentação encontrada</p>
          {temFiltroAtivo && (
            <button onClick={resetFiltros} className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {filtradas.length > 0 && (
        <>
          {/* Header row */}
          <div className="hidden lg:grid grid-cols-[1.2fr_1fr_1fr_0.7fr_1.1fr_1.4fr_1fr] gap-2 px-3 py-2 text-[10px] font-semibold text-white/25 uppercase tracking-widest border-b border-white/8 mb-1">
            <span>Data/Hora</span>
            <span>Tipo</span>
            <span>Operação</span>
            <span className="text-center">Qtd</span>
            <span className="text-center">Saldo</span>
            <span>Origem</span>
            <span>Usuário</span>
          </div>

          <div className="space-y-0.5">
            <AnimatePresence mode="popLayout">
              {visiveis.map((mov, i) => {
                const isEntrada = mov.operacao === 'entrada'
                const [datePart, timePart = ''] = mov.criado_em.split(' ')
                return (
                  <motion.div
                    key={mov.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, delay: Math.min(i, 9) * 0.025 }}
                    className="lg:grid lg:grid-cols-[1.2fr_1fr_1fr_0.7fr_1.1fr_1.4fr_1fr] lg:gap-2 px-3 py-3 rounded-xl hover:bg-white/3 transition-colors"
                  >
                    {/* Mobile card */}
                    <div className="flex lg:hidden flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {isEntrada ? (
                            <ArrowUpCircle size={14} className="text-emerald-400 shrink-0" />
                          ) : (
                            <ArrowDownCircle size={14} className="text-red-400 shrink-0" />
                          )}
                          <span className={cn('text-xs font-medium shrink-0', isEntrada ? 'text-emerald-400' : 'text-red-400')}>
                            {isEntrada ? 'Entrada' : 'Saída'}
                          </span>
                          <MovimentacaoBadge tipo={mov.tipo} />
                        </div>
                        <span className={cn('text-sm font-bold shrink-0', isEntrada ? 'text-emerald-400' : 'text-red-400')}>
                          {isEntrada ? '+' : '−'}{mov.quantidade}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <RastreabilidadeCell mov={mov} />
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-white/50">{datePart}</p>
                          {timePart && <p className="text-[10px] text-white/25">{timePart}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="hidden lg:block self-center">
                      <p className="text-xs text-white/70">{datePart}</p>
                      {timePart && <p className="text-[10px] text-white/30">{timePart}</p>}
                    </div>

                    {/* Type badge */}
                    <div className="hidden lg:flex self-center">
                      <MovimentacaoBadge tipo={mov.tipo} />
                    </div>

                    {/* Operation */}
                    <div className="hidden lg:flex items-center gap-1.5 self-center">
                      {isEntrada ? (
                        <>
                          <ArrowUpCircle size={14} className="text-emerald-400 shrink-0" />
                          <span className="text-xs text-emerald-400 font-medium">Entrada</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownCircle size={14} className="text-red-400 shrink-0" />
                          <span className="text-xs text-red-400 font-medium">Saída</span>
                        </>
                      )}
                    </div>

                    {/* Qty */}
                    <div className="hidden lg:flex items-center justify-center self-center">
                      <span className={cn('text-sm font-semibold', isEntrada ? 'text-emerald-400' : 'text-red-400')}>
                        {isEntrada ? '+' : '−'}{mov.quantidade}
                      </span>
                    </div>

                    {/* Balance */}
                    <div className="hidden lg:flex items-center justify-center gap-1.5 self-center">
                      <span className="text-xs text-white/35">{mov.estoque_antes}</span>
                      <ArrowRight size={11} className="text-white/20" />
                      <span className={cn('text-xs font-semibold', isEntrada ? 'text-emerald-400' : 'text-orange-400')}>
                        {mov.estoque_depois}
                      </span>
                    </div>

                    {/* Origin */}
                    <div className="hidden lg:block self-center">
                      <RastreabilidadeCell mov={mov} />
                    </div>

                    {/* User */}
                    <div className="hidden lg:flex items-center self-center">
                      <AvatarUser nome={mov.usuario} />
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="mt-4 flex flex-col items-center gap-3 border-t border-white/5 pt-4">
            <p className="text-xs text-white/30">
              Exibindo {visiveis.length} de {filtradas.length} movimentações
            </p>
            {temMais && (
              <button
                onClick={() => setPagina((p) => p + 1)}
                className="px-4 py-2 text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 rounded-lg transition-colors"
              >
                Carregar mais
              </button>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}
