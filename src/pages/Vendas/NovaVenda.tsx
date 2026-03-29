import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { criarVenda } from '@/store/vendasStore'
import { BuscaProduto } from '@/components/vendas/BuscaProduto'
import { BuscaCliente } from '@/components/vendas/BuscaCliente'
import { ItemVendaCard, type ItemRascunho } from '@/components/vendas/ItemVendaCard'
import { ResumoVenda } from '@/components/vendas/ResumoVenda'
import { useToast } from '@/contexts/ToastContext'
import type { FormaPagamento } from '@/types/venda'

export function NovaVenda() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [cliente, setCliente] = useState<{ id: string | null; nome: string; telefone: string | null } | null>(null)
  const [itens, setItens] = useState<ItemRascunho[]>([])
  const [descontoGeral, setDescontoGeral] = useState(0)
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('pix')
  const [parcelas, setParcelas] = useState<number | null>(null)
  const [observacoes, setObservacoes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function addProduto(produto: { id: string; nome: string; sku: string; preco_venda: number; imagem_url: string; estoque_atual: number }) {
    setItens((prev) => {
      const existing = prev.find((it) => it.produto_id === produto.id)
      if (existing) {
        return prev.map((it) =>
          it.produto_id === produto.id
            ? { ...it, quantidade: Math.min(it.quantidade + 1, produto.estoque_atual) }
            : it
        )
      }
      return [
        ...prev,
        {
          produto_id: produto.id,
          produto_nome: produto.nome,
          produto_sku: produto.sku,
          produto_imagem_url: produto.imagem_url,
          quantidade: 1,
          preco_unitario: produto.preco_venda,
          desconto_item: 0,
          estoque_disponivel: produto.estoque_atual,
        },
      ]
    })
  }

  function updateItem(idx: number, updated: ItemRascunho) {
    setItens((prev) => prev.map((it, i) => (i === idx ? updated : it)))
  }

  function removeItem(idx: number) {
    setItens((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleSubmit() {
    if (itens.length === 0) { showToast('Adicione pelo menos um produto.', 'error'); return }
    if (!cliente?.nome.trim()) { showToast('Informe o cliente ou adicione um avulso.', 'error'); return }

    setSubmitting(true)
    const subtotal = itens.reduce((acc, it) => acc + (it.preco_unitario - it.desconto_item) * it.quantidade, 0)
    const total = Math.max(0, subtotal - descontoGeral)

    const venda = criarVenda({
      cliente_id: cliente.id,
      cliente_nome: cliente.nome,
      cliente_telefone: cliente.telefone,
      itens: itens.map((it, i) => ({
        id: `i-new-${Date.now()}-${i}`,
        venda_id: '',
        produto_id: it.produto_id,
        produto_nome: it.produto_nome,
        produto_sku: it.produto_sku,
        produto_imagem_url: it.produto_imagem_url,
        quantidade: it.quantidade,
        preco_unitario: it.preco_unitario,
        desconto_item: it.desconto_item,
        subtotal: (it.preco_unitario - it.desconto_item) * it.quantidade,
      })),
      subtotal,
      desconto_geral: descontoGeral,
      total,
      forma_pagamento: formaPagamento,
      parcelas,
      observacoes: observacoes.trim() || null,
      vendedor: 'Vitor Nishida',
    })

    showToast(`Venda ${venda.numero} criada com sucesso!`, 'success')
    setTimeout(() => navigate(`/vendas/${venda.id}`), 400)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/vendas')}
          className="p-2 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Nova Venda</h1>
          <p className="text-sm text-white/40 mt-0.5">Preencha os dados abaixo para registrar um novo pedido</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Cliente */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
          >
            <h2 className="text-sm font-semibold text-white mb-4">Cliente</h2>
            <div className="relative">
              <BuscaCliente value={cliente} onChange={setCliente} />
            </div>
          </motion.div>

          {/* Produtos */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
          >
            <h2 className="text-sm font-semibold text-white mb-4">
              Produtos
              {itens.length > 0 && (
                <span className="ml-2 text-[11px] text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-2 py-0.5">
                  {itens.length}
                </span>
              )}
            </h2>

            <BuscaProduto onSelect={addProduto} />

            {itens.length > 0 && (
              <div className="mt-4 space-y-2">
                {itens.map((item, i) => (
                  <ItemVendaCard
                    key={item.produto_id}
                    item={item}
                    onChange={(updated) => updateItem(i, updated)}
                    onRemove={() => removeItem(i)}
                  />
                ))}
              </div>
            )}

            {itens.length === 0 && (
              <p className="text-xs text-white/25 text-center py-6">Nenhum produto adicionado ainda</p>
            )}
          </motion.div>

          {/* Observações */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={14} className="text-white/40" />
              <h2 className="text-sm font-semibold text-white">Observações</h2>
            </div>
            <textarea
              rows={3}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Embrulho para presente, entregar no trabalho…"
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 text-white/70 placeholder:text-white/20 text-sm rounded-xl px-4 py-3 outline-none transition-all resize-none"
            />
          </motion.div>
        </div>

        {/* Right column — sticky summary */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ResumoVenda
            itens={itens}
            descontoGeral={descontoGeral}
            formaPagamento={formaPagamento}
            parcelas={parcelas}
            onDescontoChange={setDescontoGeral}
            onFormaPagamentoChange={setFormaPagamento}
            onParcelasChange={setParcelas}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </motion.div>
      </div>
    </div>
  )
}
