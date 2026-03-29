import { vendasMock } from '@/mocks/vendas'
import { estoqueStore, movimentacoesStore } from '@/store/produtosStore'
import type { Venda, StatusVenda, ItemVenda } from '@/types/venda'
import type { MovimentacaoEstoque } from '@/types/produto'

// Module-level mutable Map — persists across navigation within the same session
export const vendasStore = new Map<string, Venda>(
  vendasMock.map((v) => [v.id, { ...v, itens: [...v.itens], timeline: [...v.timeline] }])
)

let nextId = vendasMock.length + 1
function generateId() {
  const id = `vnd-${String(nextId).padStart(3, '0')}`
  const numero = `VND-${String(nextId).padStart(3, '0')}`
  nextId++
  return { id, numero }
}

function nowString() {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  const hh = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

export function criarVenda(dados: Omit<Venda, 'id' | 'numero' | 'status' | 'timeline' | 'criado_em' | 'atualizado_em'>): Venda {
  const { id, numero } = generateId()
  const now = nowString()
  const venda: Venda = {
    ...dados,
    id,
    numero,
    status: 'orcamento',
    timeline: [{ status: 'orcamento', criado_em: now, usuario: dados.vendedor }],
    criado_em: now,
    atualizado_em: now,
  }
  vendasStore.set(id, venda)
  return venda
}

/** Advance or change the status of a venda, applying stock side-effects */
export function atualizarStatus(vendaId: string, novoStatus: StatusVenda, usuario: string): Venda | null {
  const venda = vendasStore.get(vendaId)
  if (!venda) return null

  const now = nowString()
  const atualizada: Venda = {
    ...venda,
    itens: [...venda.itens],
    timeline: [...venda.timeline, { status: novoStatus, criado_em: now, usuario }],
    status: novoStatus,
    atualizado_em: now,
  }

  // Stock side-effects
  if (novoStatus === 'em_separacao') {
    // Deduct stock when items are picked
    _baixarEstoque(venda.itens, vendaId, venda.numero, venda.cliente_nome, usuario)
  } else if (novoStatus === 'cancelada' && venda.status === 'em_separacao') {
    // Restore stock if cancelled after picking
    _restaurarEstoque(venda.itens, vendaId, venda.numero, venda.cliente_nome, usuario)
  } else if (novoStatus === 'devolvida') {
    // Restore stock on return
    _restaurarEstoque(venda.itens, vendaId, venda.numero, venda.cliente_nome, usuario)
  }

  vendasStore.set(vendaId, atualizada)
  return atualizada
}

function _baixarEstoque(itens: ItemVenda[], vendaId: string, vendaNumero: string, clienteNome: string, usuario: string) {
  for (const item of itens) {
    const estoque = estoqueStore.get(item.produto_id)
    if (!estoque) continue
    const antes = estoque.estoque_atual
    estoque.estoque_atual = Math.max(0, antes - item.quantidade)
    estoqueStore.set(item.produto_id, estoque)

    const mov: MovimentacaoEstoque = {
      id: `mov-auto-${Date.now()}-${item.produto_id}`,
      produto_id: item.produto_id,
      tipo: 'venda',
      operacao: 'saida',
      quantidade: item.quantidade,
      estoque_antes: antes,
      estoque_depois: estoque.estoque_atual,
      motivo: `Saída pela venda ${vendaNumero}`,
      referencia_id: vendaId,
      referencia_numero: vendaNumero,
      referencia_descricao: `Venda para ${clienteNome}`,
      referencia_tipo: 'venda',
      cliente_nome: clienteNome,
      fornecedor_nome: null,
      usuario,
      criado_em: nowString(),
    }
    movimentacoesStore.push(mov)
  }
}

function _restaurarEstoque(itens: ItemVenda[], vendaId: string, vendaNumero: string, clienteNome: string, usuario: string) {
  for (const item of itens) {
    const estoque = estoqueStore.get(item.produto_id)
    if (!estoque) continue
    const antes = estoque.estoque_atual
    estoque.estoque_atual = antes + item.quantidade
    estoqueStore.set(item.produto_id, estoque)

    const mov: MovimentacaoEstoque = {
      id: `mov-auto-${Date.now()}-${item.produto_id}`,
      produto_id: item.produto_id,
      tipo: 'devolucao_cliente',
      operacao: 'entrada',
      quantidade: item.quantidade,
      estoque_antes: antes,
      estoque_depois: estoque.estoque_atual,
      motivo: `Retorno pela venda ${vendaNumero}`,
      referencia_id: vendaId,
      referencia_numero: vendaNumero,
      referencia_descricao: `Devolução de ${clienteNome}`,
      referencia_tipo: 'devolucao',
      cliente_nome: clienteNome,
      fornecedor_nome: null,
      usuario,
      criado_em: nowString(),
    }
    movimentacoesStore.push(mov)
  }
}
