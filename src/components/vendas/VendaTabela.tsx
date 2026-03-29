import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronRight, ShoppingBag } from 'lucide-react'
import type { Venda, StatusVenda } from '@/types/venda'
import type { FormaPagamento } from '@/types/venda'
import { VendaStatusBadge } from './VendaStatusBadge'
import { cn } from '@/lib/utils'

interface Props {
  vendas: Venda[]
}

type FiltroStatus = 'todos' | StatusVenda

const statusOptions: { label: string; value: FiltroStatus }[] = [
  { label: 'Todos',        value: 'todos' },
  { label: 'Orçamento',    value: 'orcamento' },
  { label: 'Confirmada',   value: 'confirmada' },
  { label: 'Em Separação', value: 'em_separacao' },
  { label: 'Entregue',     value: 'entregue' },
  { label: 'Cancelada',    value: 'cancelada' },
  { label: 'Devolvida',    value: 'devolvida' },
]

const pagamentoLabels: Record<FormaPagamento, string> = {
  dinheiro:       'Dinheiro',
  pix:            'Pix',
  cartao_debito:  'Débito',
  cartao_credito: 'Crédito',
  boleto:         'Boleto',
  crediario:      'Crediário',
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parse(s: string) {
  const [d, t = '00:00'] = s.split(' ')
  const [day, mon, yr] = d.split('/')
  return new Date(`${yr}-${mon}-${day}T${t}`).getTime()
}

const PAGE_SIZE = 15

export function VendaTabela({ vendas }: Props) {
  const navigate = useNavigate()
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos')
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)

  const filtradas = useMemo(() => {
    const termo = busca.toLowerCase().trim()
    return [...vendas]
      .sort((a, b) => parse(b.criado_em) - parse(a.criado_em))
      .filter((v) => {
        const matchStatus = filtroStatus === 'todos' || v.status === filtroStatus
        const matchBusca =
          !termo ||
          v.numero.toLowerCase().includes(termo) ||
          v.cliente_nome.toLowerCase().includes(termo) ||
          v.vendedor.toLowerCase().includes(termo)
        return matchStatus && matchBusca
      })
  }, [vendas, filtroStatus, busca])

  const visiveis = filtradas.slice(0, pagina * PAGE_SIZE)
  const temMais = visiveis.length < filtradas.length
  const temFiltro = filtroStatus !== 'todos' || busca !== ''

  function reset() { setFiltroStatus('todos'); setBusca(''); setPagina(1) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 p-4 border-b border-white/8">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 flex-wrap">
          {statusOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => { setFiltroStatus(o.value); setPagina(1) }}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                filtroStatus === o.value ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white/70'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              type="text"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPagina(1) }}
              placeholder="Buscar por nº, cliente…"
              className="bg-white/5 border border-white/10 text-white/70 placeholder:text-white/20 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-indigo-500/50 transition-all w-48"
            />
          </div>
          {temFiltro && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 border border-white/10 transition-all shrink-0"
            >
              <X size={11} /> Limpar
            </button>
          )}
        </div>
      </div>

      {/* Table header */}
      <div className="hidden lg:grid grid-cols-[1fr_1.4fr_1fr_0.9fr_0.9fr_0.9fr_36px] gap-3 px-5 py-2.5 text-[10px] font-semibold text-white/25 uppercase tracking-widest border-b border-white/8">
        <span>Número</span>
        <span>Cliente</span>
        <span>Itens</span>
        <span>Total</span>
        <span>Pagamento</span>
        <span>Status</span>
        <span />
      </div>

      {/* Empty state */}
      {filtradas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag size={28} className="text-white/15 mb-3" />
          <p className="text-sm text-white/40">Nenhuma venda encontrada</p>
          {temFiltro && (
            <button onClick={reset} className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Rows */}
      {filtradas.length > 0 && (
        <>
          <div className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {visiveis.map((venda, i) => (
                <motion.button
                  key={venda.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, delay: Math.min(i, 14) * 0.02 }}
                  onClick={() => navigate(`/vendas/${venda.id}`)}
                  className="w-full text-left grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr_0.9fr_0.9fr_0.9fr_36px] gap-3 px-5 py-3.5 hover:bg-white/3 transition-colors group"
                >
                  {/* Número */}
                  <div className="self-center">
                    <p className="text-xs font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors">{venda.numero}</p>
                    <p className="text-[10px] text-white/30">{venda.criado_em.split(' ')[0]}</p>
                  </div>

                  {/* Cliente */}
                  <div className="self-center min-w-0">
                    <p className="text-xs text-white/80 truncate">{venda.cliente_nome}</p>
                    {venda.cliente_telefone && (
                      <p className="text-[10px] text-white/30 truncate">{venda.cliente_telefone}</p>
                    )}
                  </div>

                  {/* Itens */}
                  <div className="self-center hidden lg:block">
                    <p className="text-xs text-white/50 truncate">
                      {venda.itens.length === 1
                        ? venda.itens[0].produto_nome
                        : `${venda.itens.length} produtos`}
                    </p>
                    <p className="text-[10px] text-white/25">
                      {venda.itens.reduce((a, it) => a + it.quantidade, 0)} unid.
                    </p>
                  </div>

                  {/* Total */}
                  <div className="self-center hidden lg:block">
                    <p className="text-xs font-semibold text-white/80">{fmt(venda.total)}</p>
                    {venda.desconto_geral > 0 && (
                      <p className="text-[10px] text-emerald-400/60">-{fmt(venda.desconto_geral)}</p>
                    )}
                  </div>

                  {/* Pagamento */}
                  <div className="self-center hidden lg:block">
                    <p className="text-xs text-white/50">{pagamentoLabels[venda.forma_pagamento]}</p>
                    {venda.parcelas && <p className="text-[10px] text-white/25">{venda.parcelas}x</p>}
                  </div>

                  {/* Status */}
                  <div className="self-center hidden lg:block">
                    <VendaStatusBadge status={venda.status} />
                  </div>

                  {/* Arrow */}
                  <div className="self-center hidden lg:flex justify-end">
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>

                  {/* Mobile second line */}
                  <div className="flex lg:hidden items-center gap-2 -mt-1 flex-wrap">
                    <span className="text-xs font-semibold text-white/70">{fmt(venda.total)}</span>
                    <VendaStatusBadge status={venda.status} />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-3 p-4 border-t border-white/5">
            <p className="text-xs text-white/30">Exibindo {visiveis.length} de {filtradas.length} vendas</p>
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
