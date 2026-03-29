import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Phone, CreditCard, MessageSquare, Package, ChevronRight } from 'lucide-react'
import { vendasStore, atualizarStatus } from '@/store/vendasStore'
import { VendaStatusBadge } from '@/components/vendas/VendaStatusBadge'
import { VendaStatusTimeline } from '@/components/vendas/VendaStatusTimeline'
import { ModalConfirmacaoStatus } from '@/components/vendas/ModalConfirmacaoStatus'
import { useToast } from '@/contexts/ToastContext'
import type { StatusVenda, FormaPagamento } from '@/types/venda'

const pagamentoLabels: Record<FormaPagamento, string> = {
  dinheiro:       'Dinheiro',
  pix:            'Pix',
  cartao_debito:  'Cartão de Débito',
  cartao_credito: 'Cartão de Crédito',
  boleto:         'Boleto',
  crediario:      'Crediário',
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Status transitions
const transitions: Record<StatusVenda, StatusVenda[]> = {
  orcamento:    ['confirmada', 'cancelada'],
  confirmada:   ['em_separacao', 'cancelada'],
  em_separacao: ['entregue', 'cancelada'],
  entregue:     ['devolvida'],
  cancelada:    [],
  devolvida:    [],
}

const transitionLabels: Record<StatusVenda, string> = {
  confirmada:   'Confirmar Venda',
  em_separacao: 'Iniciar Separação',
  entregue:     'Marcar Entregue',
  cancelada:    'Cancelar',
  devolvida:    'Registrar Devolução',
  orcamento:    '',
}

const transitionStyles: Record<StatusVenda, string> = {
  confirmada:   'bg-blue-600 hover:bg-blue-500 text-white',
  em_separacao: 'bg-amber-500 hover:bg-amber-400 text-white',
  entregue:     'bg-emerald-600 hover:bg-emerald-500 text-white',
  cancelada:    'bg-red-600/80 hover:bg-red-500 text-white',
  devolvida:    'bg-purple-600 hover:bg-purple-500 text-white',
  orcamento:    '',
}

export function VendaDetalhe() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [, setTick] = useState(0)
  const [pendingStatus, setPendingStatus] = useState<StatusVenda | null>(null)

  const venda = id ? vendasStore.get(id) : undefined

  if (!venda) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-white/40 text-sm">Venda não encontrada.</p>
        <button onClick={() => navigate('/vendas')} className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
          Voltar para Vendas
        </button>
      </div>
    )
  }

  function handleConfirmStatus() {
    if (!pendingStatus || !venda) return
    const updated = atualizarStatus(venda.id, pendingStatus, 'Vitor Nishida')
    if (updated) {
      setTick((t) => t + 1)
      showToast(`Status atualizado para "${updated.status.replace('_', ' ')}"`, 'success')
    }
    setPendingStatus(null)
  }

  const nextStatuses = transitions[venda.status]
  const subtotalDesc = venda.itens.reduce((a, it) => a + it.desconto_item * it.quantidade, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start gap-4"
      >
        <button
          onClick={() => navigate('/vendas')}
          className="p-2 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors mt-0.5 shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-white">{venda.numero}</h1>
            <VendaStatusBadge status={venda.status} size="md" />
          </div>
          <p className="text-sm text-white/40 mt-0.5 truncate">
            {venda.cliente_nome} · {venda.criado_em}
          </p>
        </div>

        {/* Action buttons */}
        {nextStatuses.length > 0 && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            {nextStatuses.map((s) => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPendingStatus(s)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${transitionStyles[s]}`}
              >
                {transitionLabels[s]}
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Cliente */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
          >
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-4">Cliente</h2>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold shrink-0">
                {venda.cliente_nome.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <User size={12} className="text-white/30 shrink-0" />
                  <p className="text-sm text-white/80">{venda.cliente_nome}</p>
                  {venda.cliente_id && (
                    <button
                      onClick={() => navigate(`/clientes/${venda.cliente_id}`)}
                      className="flex items-center gap-0.5 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Ver cadastro <ChevronRight size={10} />
                    </button>
                  )}
                </div>
                {venda.cliente_telefone && (
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-white/30 shrink-0" />
                    <p className="text-xs text-white/50">{venda.cliente_telefone}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CreditCard size={12} className="text-white/30 shrink-0" />
                  <p className="text-xs text-white/50">
                    {pagamentoLabels[venda.forma_pagamento]}
                    {venda.parcelas ? ` · ${venda.parcelas}x ${fmt(venda.total / venda.parcelas)}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Itens */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Package size={14} className="text-white/40" />
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                Itens ({venda.itens.length})
              </h2>
            </div>

            <div className="space-y-3">
              {venda.itens.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.produto_imagem_url}
                    alt={item.produto_nome}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 bg-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/80 truncate">{item.produto_nome}</p>
                    <p className="text-[10px] text-white/35">
                      {item.produto_sku} · {item.quantidade}x {fmt(item.preco_unitario)}
                      {item.desconto_item > 0 && (
                        <span className="text-emerald-400/60"> (-{fmt(item.desconto_item)} desc.)</span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white/70 shrink-0">{fmt(item.subtotal)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-white/8 space-y-1.5">
              <div className="flex justify-between text-xs text-white/40">
                <span>Subtotal</span>
                <span>{fmt(venda.subtotal)}</span>
              </div>
              {subtotalDesc > 0 && (
                <div className="flex justify-between text-xs text-emerald-400/60">
                  <span>Descontos por item</span>
                  <span>-{fmt(subtotalDesc)}</span>
                </div>
              )}
              {venda.desconto_geral > 0 && (
                <div className="flex justify-between text-xs text-emerald-400/60">
                  <span>Desconto geral</span>
                  <span>-{fmt(venda.desconto_geral)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1 mt-1 border-t border-white/8">
                <span className="text-sm font-semibold text-white">Total</span>
                <span className="text-lg font-bold text-white">{fmt(venda.total)}</span>
              </div>
            </div>
          </motion.div>

          {/* Observações */}
          {venda.observacoes && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-white/40" />
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wide">Observações</h2>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{venda.observacoes}</p>
            </motion.div>
          )}
        </div>

        {/* Right column — timeline */}
        <div className="space-y-5">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
          >
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-4">Linha do Tempo</h2>
            <VendaStatusTimeline timeline={venda.timeline} statusAtual={venda.status} />
          </motion.div>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-3"
          >
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wide">Informações</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/35">Vendedor</span>
                <span className="text-white/60">{venda.vendedor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/35">Criado em</span>
                <span className="text-white/60">{venda.criado_em}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/35">Atualizado</span>
                <span className="text-white/60">{venda.atualizado_em}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ModalConfirmacaoStatus
        open={!!pendingStatus}
        novoStatus={pendingStatus}
        onClose={() => setPendingStatus(null)}
        onConfirm={handleConfirmStatus}
      />
    </div>
  )
}
