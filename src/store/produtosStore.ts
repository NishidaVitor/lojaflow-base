import { produtosMock } from '@/mocks/produtos'
import { estoqueProdutoMock } from '@/mocks/estoque_produto'
import { movimentacoesMock } from '@/mocks/movimentacoes_estoque'
import type { Produto, EstoqueProduto, MovimentacaoEstoque } from '@/types/produto'

// Module-level mutable Maps — persist across navigation within the same session
export const produtosStore = new Map<string, Produto>(
  produtosMock.map((p) => [p.id, { ...p }])
)

export const estoqueStore = new Map<string, EstoqueProduto>(
  estoqueProdutoMock.map((e) => [e.produto_id, { ...e }])
)

// Array is mutated directly — push new entries on registration
export const movimentacoesStore: MovimentacaoEstoque[] = [...movimentacoesMock]
