export interface Cliente {
  id: string
  nome: string
  telefone: string
  email: string
  endereco: string
  cidade: string
  status: 'ativo' | 'inativo'
  totalCompras: number
  totalPedidos: number
  ultimaCompra: string
  dataCadastro: string
  observacoes: string
}
