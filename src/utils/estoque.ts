import type { EstoqueProduto, StatusEstoque } from '@/types/produto'

export function getStatusEstoque(estoque: EstoqueProduto): StatusEstoque {
  if (estoque.estoque_atual === 0) return 'zerado'
  if (estoque.estoque_atual <= estoque.estoque_minimo * 0.5) return 'critico'
  if (estoque.estoque_atual <= estoque.estoque_minimo) return 'baixo'
  return 'normal'
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatDate(dateStr: string): string {
  return dateStr
}
