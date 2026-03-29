export const salesData = [
  { day: 'Seg', vendas: 4200 },
  { day: 'Ter', vendas: 6800 },
  { day: 'Qua', vendas: 5100 },
  { day: 'Qui', vendas: 7300 },
  { day: 'Sex', vendas: 9200 },
  { day: 'Sáb', vendas: 11500 },
  { day: 'Dom', vendas: 8700 },
]

export const categoryData = [
  { name: 'Camisetas', value: 35, color: '#4F46E5' },
  { name: 'Calças', value: 25, color: '#7C3AED' },
  { name: 'Vestidos', value: 20, color: '#06B6D4' },
  { name: 'Acessórios', value: 12, color: '#10B981' },
  { name: 'Outros', value: 8, color: '#F59E0B' },
]

export const recentSales = [
  {
    id: '#0012',
    produto: 'Camiseta Básica Preta',
    cliente: 'Ana Lima',
    valor: 89.9,
    status: 'concluído',
    data: '28/03 14:32',
  },
  {
    id: '#0011',
    produto: 'Calça Jeans Slim',
    cliente: 'Carlos Mendes',
    valor: 179.9,
    status: 'concluído',
    data: '28/03 13:10',
  },
  {
    id: '#0010',
    produto: 'Vestido Floral',
    cliente: 'Beatriz Costa',
    valor: 129.9,
    status: 'pendente',
    data: '28/03 12:05',
  },
  {
    id: '#0009',
    produto: 'Óculos de Sol',
    cliente: 'Lucas Ferreira',
    valor: 219.9,
    status: 'concluído',
    data: '28/03 10:48',
  },
  {
    id: '#0008',
    produto: 'Tênis Casual',
    cliente: 'Mariana Souza',
    valor: 299.9,
    status: 'cancelado',
    data: '28/03 09:22',
  },
]

export const metrics = {
  vendasHoje: {
    valor: 'R$ 8.742,00',
    variacao: '+12,4%',
    positivo: true,
    subtitulo: 'vs. ontem',
  },
  pedidosDia: {
    valor: '34',
    variacao: '+8',
    positivo: true,
    subtitulo: 'pedidos hoje',
  },
  estoque: {
    valor: '1.248',
    variacao: '12 alertas',
    positivo: false,
    subtitulo: 'produtos cadastrados',
  },
  clientesAtivos: {
    valor: '892',
    variacao: '+5 hoje',
    positivo: true,
    subtitulo: 'clientes ativos',
  },
}
