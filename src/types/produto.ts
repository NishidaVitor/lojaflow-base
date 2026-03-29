export interface Categoria {
  id: string
  nome: string
  descricao: string
  ativo: boolean
}

export interface Produto {
  id: string
  nome: string
  descricao: string
  sku: string
  codigo_barras: string
  categoria_id: string
  marca: string
  unidade_medida: 'un' | 'kg' | 'par'
  preco_custo: number
  preco_venda: number
  preco_promocional: number | null
  imagem_url: string
  ativo: boolean
  criado_em: string
}

export interface EstoqueProduto {
  id: string
  produto_id: string
  estoque_real: number
  estoque_reservado: number
  estoque_atual: number
  estoque_minimo: number
  estoque_maximo: number
  localizacao: string
  atualizado_em: string
}

export interface MovimentacaoEstoque {
  id: string
  produto_id: string
  tipo: 'compra' | 'venda' | 'ajuste_positivo' | 'ajuste_negativo' | 'devolucao_cliente' | 'perda'
  operacao: 'entrada' | 'saida'
  quantidade: number
  estoque_antes: number
  estoque_depois: number
  motivo: string
  // Rastreabilidade
  referencia_id: string | null
  referencia_tipo: 'venda' | 'compra' | 'ajuste' | 'devolucao' | 'perda' | null
  referencia_numero: string | null
  referencia_descricao: string | null
  cliente_nome: string | null
  fornecedor_nome: string | null
  usuario: string
  criado_em: string
}

export interface ProdutoComEstoque {
  produto: Produto
  estoque: EstoqueProduto
  categoria: Categoria
}

export type StatusEstoque = 'normal' | 'baixo' | 'critico' | 'zerado'
