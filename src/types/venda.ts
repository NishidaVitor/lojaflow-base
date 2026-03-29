export type StatusVenda =
  | 'orcamento'
  | 'confirmada'
  | 'em_separacao'
  | 'entregue'
  | 'cancelada'
  | 'devolvida'

export type FormaPagamento =
  | 'dinheiro'
  | 'pix'
  | 'cartao_debito'
  | 'cartao_credito'
  | 'boleto'
  | 'crediario'

export interface ItemVenda {
  id: string
  venda_id: string
  produto_id: string
  produto_nome: string
  produto_sku: string
  produto_imagem_url: string
  quantidade: number
  preco_unitario: number
  desconto_item: number
  subtotal: number
}

export interface StatusEvent {
  status: StatusVenda
  criado_em: string
  usuario: string
}

export interface Venda {
  id: string
  numero: string
  cliente_id: string | null
  cliente_nome: string
  cliente_telefone: string | null
  itens: ItemVenda[]
  subtotal: number
  desconto_geral: number
  total: number
  forma_pagamento: FormaPagamento
  parcelas: number | null
  status: StatusVenda
  timeline: StatusEvent[]
  observacoes: string | null
  vendedor: string
  criado_em: string
  atualizado_em: string
}
