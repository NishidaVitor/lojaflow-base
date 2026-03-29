import type { Venda, StatusVenda, FormaPagamento } from '@/types/venda'
import type {
  Produto,
  EstoqueProduto,
  MovimentacaoEstoque,
  Categoria,
  StatusEstoque,
} from '@/types/produto'
import type { Cliente } from '@/types/cliente'
import { getStatusEstoque } from '@/utils/estoque'

export type PeriodoOpcao =
  | 'hoje'
  | 'semana'
  | 'mes'
  | '3meses'
  | 'ano'
  | 'personalizado'

// ─── Date & Format Helpers ────────────────────────────────────────────────────

export function parseDate(dateStr: string): Date {
  const [datePart, timePart] = dateStr.trim().split(' ')
  const [d, m, y] = datePart.split('/').map(Number)
  if (timePart) {
    const [h, min] = timePart.split(':').map(Number)
    return new Date(y, m - 1, d, h, min)
  }
  return new Date(y, m - 1, d)
}

export function formatDateLabel(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function formatCurrency(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function isInRange(dateStr: string, inicio: Date, fim: Date): boolean {
  const d = parseDate(dateStr)
  return d >= inicio && d <= fim
}

function generateDaysInRange(inicio: Date, fim: Date): Date[] {
  const days: Date[] = []
  const current = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate())
  const end = new Date(fim.getFullYear(), fim.getMonth(), fim.getDate())
  while (current <= end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return days
}

export function getPeriodDates(
  periodo: PeriodoOpcao,
  dataInicio?: string,
  dataFim?: string
): { inicio: Date; fim: Date } {
  const now = new Date()
  const eod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  switch (periodo) {
    case 'hoje':
      return { inicio: new Date(now.getFullYear(), now.getMonth(), now.getDate()), fim: eod }
    case 'semana': {
      const dow = now.getDay()
      return {
        inicio: new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow),
        fim: eod,
      }
    }
    case 'mes':
      return { inicio: new Date(now.getFullYear(), now.getMonth(), 1), fim: eod }
    case '3meses':
      return { inicio: new Date(now.getFullYear(), now.getMonth() - 2, 1), fim: eod }
    case 'ano':
      return { inicio: new Date(now.getFullYear(), 0, 1), fim: eod }
    case 'personalizado':
      if (dataInicio && dataFim) {
        return { inicio: parseDate(dataInicio), fim: parseDate(dataFim + ' 23:59') }
      }
      return { inicio: new Date(now.getFullYear(), now.getMonth(), 1), fim: eod }
    default:
      return { inicio: new Date(now.getFullYear(), now.getMonth(), 1), fim: eod }
  }
}

export const FORMA_PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
  dinheiro: 'Dinheiro',
  pix: 'PIX',
  cartao_debito: 'Cartão de Débito',
  cartao_credito: 'Cartão de Crédito',
  boleto: 'Boleto',
  crediario: 'Crediário',
}

const STATUS_ORDER: Record<StatusEstoque, number> = {
  zerado: 0,
  critico: 1,
  baixo: 2,
  normal: 3,
}

const INACTIVE_STATUSES: StatusVenda[] = ['cancelada', 'devolvida', 'orcamento']

// ─── 1. Faturamento por Período ───────────────────────────────────────────────

export interface FaturamentoPorDia {
  data: string
  faturamento: number
  quantidade: number
  ticketMedio: number
}

export interface FaturamentoPeriodoResult {
  grafico: FaturamentoPorDia[]
  tabela: FaturamentoPorDia[]
  totais: {
    totalFaturado: number
    quantidadeVendas: number
    ticketMedio: number
    maiorVenda: number
  }
}

export function calcularFaturamentoPorPeriodo(
  vendas: Venda[],
  inicio: Date,
  fim: Date,
  statusFiltro: StatusVenda[]
): FaturamentoPeriodoResult {
  const filtradas = vendas.filter(
    (v) => statusFiltro.includes(v.status) && isInRange(v.criado_em, inicio, fim)
  )
  const days = generateDaysInRange(inicio, fim)

  const grafico: FaturamentoPorDia[] = days.map((day) => {
    const dv = filtradas.filter((v) => {
      const d = parseDate(v.criado_em)
      return (
        d.getDate() === day.getDate() &&
        d.getMonth() === day.getMonth() &&
        d.getFullYear() === day.getFullYear()
      )
    })
    const fat = dv.reduce((s, v) => s + v.total, 0)
    const qtd = dv.length
    return {
      data: formatDateLabel(day),
      faturamento: Math.round(fat * 100) / 100,
      quantidade: qtd,
      ticketMedio: qtd > 0 ? Math.round((fat / qtd) * 100) / 100 : 0,
    }
  })

  const tabela = grafico.filter((d) => d.quantidade > 0).reverse()
  const total = filtradas.reduce((s, v) => s + v.total, 0)
  const qtd = filtradas.length

  return {
    grafico,
    tabela,
    totais: {
      totalFaturado: Math.round(total * 100) / 100,
      quantidadeVendas: qtd,
      ticketMedio: qtd > 0 ? Math.round((total / qtd) * 100) / 100 : 0,
      maiorVenda: filtradas.length > 0 ? Math.max(...filtradas.map((v) => v.total)) : 0,
    },
  }
}

// ─── 2. Vendas por Forma de Pagamento ─────────────────────────────────────────

export interface VendaFormaPgtoItem {
  forma: FormaPagamento
  label: string
  qtdVendas: number
  pctVendas: number
  totalValor: number
  pctValor: number
  ticketMedio: number
}

export interface VendasFormaPgtoResult {
  dados: VendaFormaPgtoItem[]
  totais: {
    formaMaisUsada: string
    formaComMaiorValor: string
    totalVendas: number
    pctAVista: number
  }
}

export function calcularVendasPorFormaPagamento(
  vendas: Venda[],
  inicio: Date,
  fim: Date
): VendasFormaPgtoResult {
  const filtradas = vendas.filter(
    (v) => isInRange(v.criado_em, inicio, fim) && !INACTIVE_STATUSES.includes(v.status)
  )
  const totalVendas = filtradas.length
  const totalValor = filtradas.reduce((s, v) => s + v.total, 0)
  const formas: FormaPagamento[] = [
    'dinheiro',
    'pix',
    'cartao_debito',
    'cartao_credito',
    'boleto',
    'crediario',
  ]

  const dados: VendaFormaPgtoItem[] = formas
    .map((forma) => {
      const sub = filtradas.filter((v) => v.forma_pagamento === forma)
      const qtd = sub.length
      const val = sub.reduce((s, v) => s + v.total, 0)
      return {
        forma,
        label: FORMA_PAGAMENTO_LABELS[forma],
        qtdVendas: qtd,
        pctVendas: totalVendas > 0 ? (qtd / totalVendas) * 100 : 0,
        totalValor: val,
        pctValor: totalValor > 0 ? (val / totalValor) * 100 : 0,
        ticketMedio: qtd > 0 ? val / qtd : 0,
      }
    })
    .filter((d) => d.qtdVendas > 0)

  const maisUsada = dados.reduce((a, b) => (a.qtdVendas > b.qtdVendas ? a : b), dados[0])
  const maiorValor = dados.reduce((a, b) => (a.totalValor > b.totalValor ? a : b), dados[0])
  const aVistaVal = filtradas
    .filter((v) => ['dinheiro', 'pix', 'cartao_debito'].includes(v.forma_pagamento))
    .reduce((s, v) => s + v.total, 0)

  return {
    dados,
    totais: {
      formaMaisUsada: maisUsada?.label || '-',
      formaComMaiorValor: maiorValor?.label || '-',
      totalVendas,
      pctAVista: totalValor > 0 ? (aVistaVal / totalValor) * 100 : 0,
    },
  }
}

// ─── 3. Vendas por Cliente ────────────────────────────────────────────────────

export interface VendasClienteItem {
  clienteId: string | null
  clienteNome: string
  status: string
  qtdPedidos: number
  totalGasto: number
  ticketMedio: number
  ultimaCompra: string | null
}

export interface VendasClienteResult {
  dados: VendasClienteItem[]
  totais: {
    totalClientes: number
    clienteTop: string
    mediaCompras: number
    pctRecorrentes: number
  }
}

export function calcularVendasPorCliente(
  vendas: Venda[],
  clientes: Cliente[],
  inicio: Date,
  fim: Date,
  statusCliente: 'todos' | 'ativos' | 'inativos',
  incluirAvulsos: boolean,
  ordenarPor: 'valor' | 'quantidade' | 'recente'
): VendasClienteResult {
  const filtradas = vendas.filter(
    (v) => isInRange(v.criado_em, inicio, fim) && !INACTIVE_STATUSES.includes(v.status)
  )
  const map = new Map<string, VendasClienteItem>()

  for (const v of filtradas) {
    const isAvulso = !v.cliente_id
    if (!incluirAvulsos && isAvulso) continue
    const cliente = clientes.find((c) => c.id === v.cliente_id)
    if (!isAvulso && statusCliente === 'ativos' && cliente?.status !== 'ativo') continue
    if (!isAvulso && statusCliente === 'inativos' && cliente?.status !== 'inativo') continue

    const key = v.cliente_id || 'avulso'
    if (!map.has(key)) {
      map.set(key, {
        clienteId: v.cliente_id,
        clienteNome: v.cliente_nome,
        status: cliente?.status || 'avulso',
        qtdPedidos: 0,
        totalGasto: 0,
        ticketMedio: 0,
        ultimaCompra: null,
      })
    }
    const item = map.get(key)!
    item.qtdPedidos++
    item.totalGasto += v.total
    item.ultimaCompra = v.criado_em
  }

  for (const item of map.values()) {
    item.ticketMedio = item.qtdPedidos > 0 ? item.totalGasto / item.qtdPedidos : 0
  }

  let dados = Array.from(map.values())
  if (ordenarPor === 'valor') dados.sort((a, b) => b.totalGasto - a.totalGasto)
  else if (ordenarPor === 'quantidade') dados.sort((a, b) => b.qtdPedidos - a.qtdPedidos)
  else
    dados.sort((a, b) => {
      if (!a.ultimaCompra) return 1
      if (!b.ultimaCompra) return -1
      return parseDate(b.ultimaCompra).getTime() - parseDate(a.ultimaCompra).getTime()
    })

  const comId = dados.filter((d) => d.clienteId)
  const totalClientes = comId.length
  const recorrentes = comId.filter((d) => d.qtdPedidos >= 2).length

  return {
    dados,
    totais: {
      totalClientes,
      clienteTop: dados[0]?.clienteNome || '-',
      mediaCompras:
        totalClientes > 0
          ? comId.reduce((s, d) => s + d.totalGasto, 0) / totalClientes
          : 0,
      pctRecorrentes: totalClientes > 0 ? (recorrentes / totalClientes) * 100 : 0,
    },
  }
}

// ─── 4. Produtos Mais Vendidos ────────────────────────────────────────────────

export interface ProdutoVendidoItem {
  produtoId: string
  produtoNome: string
  sku: string
  categoriaId: string
  categoriaNome: string
  imagem: string
  qtdVendida: number
  receita: number
  pctTotal: number
}

export interface ProdutosMaisVendidosResult {
  dados: ProdutoVendidoItem[]
  totais: {
    produtoMaisVendido: string
    totalItens: number
    receitaTotal: number
    categoriaMaisVendida: string
  }
}

export function calcularProdutosMaisVendidos(
  vendas: Venda[],
  produtos: Produto[],
  categorias: Categoria[],
  inicio: Date,
  fim: Date,
  categoriaFiltro: string,
  ordenarPor: 'quantidade' | 'receita',
  top: number
): ProdutosMaisVendidosResult {
  const filtradas = vendas.filter(
    (v) => isInRange(v.criado_em, inicio, fim) && !INACTIVE_STATUSES.includes(v.status)
  )
  const map = new Map<string, { qtd: number; receita: number }>()

  for (const v of filtradas) {
    for (const item of v.itens) {
      const cur = map.get(item.produto_id) || { qtd: 0, receita: 0 }
      cur.qtd += item.quantidade
      cur.receita += item.subtotal
      map.set(item.produto_id, cur)
    }
  }

  const totalQtd = Array.from(map.values()).reduce((s, v) => s + v.qtd, 0)
  let dados: ProdutoVendidoItem[] = []

  for (const [pid, agg] of map.entries()) {
    const produto = produtos.find((p) => p.id === pid)
    if (!produto) continue
    if (categoriaFiltro && produto.categoria_id !== categoriaFiltro) continue
    const cat = categorias.find((c) => c.id === produto.categoria_id)
    dados.push({
      produtoId: pid,
      produtoNome: produto.nome,
      sku: produto.sku,
      categoriaId: produto.categoria_id,
      categoriaNome: cat?.nome || '-',
      imagem: produto.imagem_url,
      qtdVendida: agg.qtd,
      receita: agg.receita,
      pctTotal: totalQtd > 0 ? (agg.qtd / totalQtd) * 100 : 0,
    })
  }

  if (ordenarPor === 'quantidade') dados.sort((a, b) => b.qtdVendida - a.qtdVendida)
  else dados.sort((a, b) => b.receita - a.receita)
  dados = dados.slice(0, top)

  const catMap = new Map<string, number>()
  for (const d of dados) catMap.set(d.categoriaId, (catMap.get(d.categoriaId) || 0) + d.qtdVendida)
  const topCat = Array.from(catMap.entries()).sort((a, b) => b[1] - a[1])[0]

  return {
    dados,
    totais: {
      produtoMaisVendido: dados[0]?.produtoNome || '-',
      totalItens: dados.reduce((s, d) => s + d.qtdVendida, 0),
      receitaTotal: dados.reduce((s, d) => s + d.receita, 0),
      categoriaMaisVendida: topCat
        ? categorias.find((c) => c.id === topCat[0])?.nome || '-'
        : '-',
    },
  }
}

// ─── 5. Posição Atual do Estoque ──────────────────────────────────────────────

export interface PosicaoEstoqueItem {
  produtoId: string
  produtoNome: string
  sku: string
  categoriaId: string
  categoriaNome: string
  estoqueReal: number
  estoqueReservado: number
  estoqueDisponivel: number
  estoqueMinimo: number
  status: StatusEstoque
  ultimaMovimentacao: string
}

export interface PosicaoEstoqueResult {
  dados: PosicaoEstoqueItem[]
  totais: { total: number; normais: number; baixoCritico: number; zerados: number }
}

export function calcularPosicaoEstoque(
  produtos: Produto[],
  estoque: EstoqueProduto[],
  categorias: Categoria[],
  movimentacoes: MovimentacaoEstoque[],
  categoriaFiltro: string,
  statusFiltro: string,
  ordenarPor: string
): PosicaoEstoqueResult {
  let dados: PosicaoEstoqueItem[] = []

  for (const est of estoque) {
    const produto = produtos.find((p) => p.id === est.produto_id)
    if (!produto) continue
    if (categoriaFiltro && produto.categoria_id !== categoriaFiltro) continue
    const status = getStatusEstoque(est)
    if (statusFiltro && statusFiltro !== 'todos' && status !== statusFiltro) continue
    const cat = categorias.find((c) => c.id === produto.categoria_id)
    const movs = movimentacoes
      .filter((m) => m.produto_id === est.produto_id)
      .sort((a, b) => parseDate(b.criado_em).getTime() - parseDate(a.criado_em).getTime())
    dados.push({
      produtoId: produto.id,
      produtoNome: produto.nome,
      sku: produto.sku,
      categoriaId: produto.categoria_id,
      categoriaNome: cat?.nome || '-',
      estoqueReal: est.estoque_real,
      estoqueReservado: est.estoque_reservado,
      estoqueDisponivel: est.estoque_atual,
      estoqueMinimo: est.estoque_minimo,
      status,
      ultimaMovimentacao: movs[0]?.criado_em || '-',
    })
  }

  switch (ordenarPor) {
    case 'nome':
      dados.sort((a, b) => a.produtoNome.localeCompare(b.produtoNome))
      break
    case 'estoque_atual':
      dados.sort((a, b) => a.estoqueDisponivel - b.estoqueDisponivel)
      break
    case 'estoque_minimo':
      dados.sort((a, b) => a.estoqueMinimo - b.estoqueMinimo)
      break
    case 'ultima_movimentacao':
      dados.sort((a, b) => {
        if (a.ultimaMovimentacao === '-') return 1
        if (b.ultimaMovimentacao === '-') return -1
        return parseDate(b.ultimaMovimentacao).getTime() - parseDate(a.ultimaMovimentacao).getTime()
      })
      break
  }

  return {
    dados,
    totais: {
      total: dados.length,
      normais: dados.filter((d) => d.status === 'normal').length,
      baixoCritico: dados.filter((d) => ['baixo', 'critico'].includes(d.status)).length,
      zerados: dados.filter((d) => d.status === 'zerado').length,
    },
  }
}

// ─── 6. Produtos Abaixo do Mínimo ─────────────────────────────────────────────

export interface ProdutoAbaixoMinimoItem {
  produtoId: string
  produtoNome: string
  categoriaId: string
  categoriaNome: string
  estoqueDisponivel: number
  estoqueMinimo: number
  deficit: number
  status: StatusEstoque
  ultimaEntrada: string
}

export interface ProdutosAbaixoMinimoResult {
  dados: ProdutoAbaixoMinimoItem[]
  totais: {
    totalAbaixo: number
    zerados: number
    criticos: number
    categoriasAfetadas: number
  }
}

export function calcularProdutosAbaixoMinimo(
  produtos: Produto[],
  estoque: EstoqueProduto[],
  categorias: Categoria[],
  movimentacoes: MovimentacaoEstoque[],
  categoriaFiltro: string,
  criticidade: 'todos' | 'criticos' | 'zerados',
  ordenarPor: 'criticidade' | 'categoria' | 'nome'
): ProdutosAbaixoMinimoResult {
  const abaixo = estoque.filter((e) => e.estoque_atual < e.estoque_minimo)
  let dados: ProdutoAbaixoMinimoItem[] = []

  for (const est of abaixo) {
    const produto = produtos.find((p) => p.id === est.produto_id)
    if (!produto) continue
    if (categoriaFiltro && produto.categoria_id !== categoriaFiltro) continue
    const status = getStatusEstoque(est)
    if (criticidade === 'criticos' && status !== 'critico') continue
    if (criticidade === 'zerados' && status !== 'zerado') continue
    const cat = categorias.find((c) => c.id === produto.categoria_id)
    const ultimaEntrada = movimentacoes
      .filter((m) => m.produto_id === est.produto_id && m.operacao === 'entrada')
      .sort((a, b) => parseDate(b.criado_em).getTime() - parseDate(a.criado_em).getTime())[0]
    dados.push({
      produtoId: produto.id,
      produtoNome: produto.nome,
      categoriaId: produto.categoria_id,
      categoriaNome: cat?.nome || '-',
      estoqueDisponivel: est.estoque_atual,
      estoqueMinimo: est.estoque_minimo,
      deficit: est.estoque_minimo - est.estoque_atual,
      status,
      ultimaEntrada: ultimaEntrada?.criado_em || '-',
    })
  }

  switch (ordenarPor) {
    case 'criticidade':
      dados.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
      break
    case 'categoria':
      dados.sort((a, b) => a.categoriaNome.localeCompare(b.categoriaNome))
      break
    case 'nome':
      dados.sort((a, b) => a.produtoNome.localeCompare(b.produtoNome))
      break
  }

  return {
    dados,
    totais: {
      totalAbaixo: dados.length,
      zerados: dados.filter((d) => d.status === 'zerado').length,
      criticos: dados.filter((d) => d.status === 'critico').length,
      categoriasAfetadas: new Set(dados.map((d) => d.categoriaId)).size,
    },
  }
}

// ─── 7. Movimentações por Período ─────────────────────────────────────────────

export interface MovimentacaoChartItem {
  data: string
  entradas: number
  saidas: number
}

export interface MovimentacaoTabelaItem {
  id: string
  criado_em: string
  produtoNome: string
  tipo: MovimentacaoEstoque['tipo']
  operacao: 'entrada' | 'saida'
  quantidade: number
  origem: string
  usuario: string
}

export interface MovimentacoesPeriodoResult {
  grafico: MovimentacaoChartItem[]
  tabela: MovimentacaoTabelaItem[]
  totais: {
    totalMovimentacoes: number
    totalEntradas: number
    totalSaidas: number
    produtoMaisMovimentos: string
  }
}

export function calcularMovimentacoesPeriodo(
  movimentacoes: MovimentacaoEstoque[],
  produtos: Produto[],
  inicio: Date,
  fim: Date,
  tipo: 'todos' | 'entradas' | 'saidas',
  origem: string,
  produtoFiltro: string
): MovimentacoesPeriodoResult {
  let filtradas = movimentacoes.filter((m) => isInRange(m.criado_em, inicio, fim))
  if (tipo === 'entradas') filtradas = filtradas.filter((m) => m.operacao === 'entrada')
  else if (tipo === 'saidas') filtradas = filtradas.filter((m) => m.operacao === 'saida')

  const origemMap: Record<string, MovimentacaoEstoque['tipo'][]> = {
    vendas: ['venda'],
    compras: ['compra'],
    ajustes: ['ajuste_positivo', 'ajuste_negativo'],
    devolucoes: ['devolucao_cliente'],
    perdas: ['perda'],
  }
  if (origem && origem !== 'todos')
    filtradas = filtradas.filter((m) => origemMap[origem]?.includes(m.tipo))
  if (produtoFiltro) filtradas = filtradas.filter((m) => m.produto_id === produtoFiltro)

  const days = generateDaysInRange(inicio, fim)
  const grafico: MovimentacaoChartItem[] = days.map((day) => {
    const dMovs = filtradas.filter((m) => {
      const d = parseDate(m.criado_em)
      return (
        d.getDate() === day.getDate() &&
        d.getMonth() === day.getMonth() &&
        d.getFullYear() === day.getFullYear()
      )
    })
    return {
      data: formatDateLabel(day),
      entradas: dMovs.filter((m) => m.operacao === 'entrada').reduce((s, m) => s + m.quantidade, 0),
      saidas: dMovs.filter((m) => m.operacao === 'saida').reduce((s, m) => s + m.quantidade, 0),
    }
  })

  const tabela: MovimentacaoTabelaItem[] = filtradas
    .sort((a, b) => parseDate(b.criado_em).getTime() - parseDate(a.criado_em).getTime())
    .map((m) => ({
      id: m.id,
      criado_em: m.criado_em,
      produtoNome: produtos.find((p) => p.id === m.produto_id)?.nome || '-',
      tipo: m.tipo,
      operacao: m.operacao,
      quantidade: m.quantidade,
      origem: m.referencia_tipo || '-',
      usuario: m.usuario,
    }))

  const prodMap = new Map<string, number>()
  for (const m of filtradas) prodMap.set(m.produto_id, (prodMap.get(m.produto_id) || 0) + 1)
  const topProd = Array.from(prodMap.entries()).sort((a, b) => b[1] - a[1])[0]

  return {
    grafico,
    tabela,
    totais: {
      totalMovimentacoes: filtradas.length,
      totalEntradas: filtradas
        .filter((m) => m.operacao === 'entrada')
        .reduce((s, m) => s + m.quantidade, 0),
      totalSaidas: filtradas
        .filter((m) => m.operacao === 'saida')
        .reduce((s, m) => s + m.quantidade, 0),
      produtoMaisMovimentos: topProd
        ? produtos.find((p) => p.id === topProd[0])?.nome || '-'
        : '-',
    },
  }
}

// ─── 8. Clientes por Status ───────────────────────────────────────────────────

export interface ClientesPorStatusResult {
  pieData: Array<{ name: string; value: number; fill: string }>
  barData: Array<{ mes: string; novos: number }>
  tabela: Array<Cliente & { totalGasto: number; qtdPedidos: number }>
  totais: { totalClientes: number; ativos: number; inativos: number; novos: number }
}

export function calcularClientesPorStatus(
  clientes: Cliente[],
  vendas: Venda[],
  inicio: Date,
  fim: Date,
  cidade: string
): ClientesPorStatusResult {
  const filtrados = cidade ? clientes.filter((c) => c.cidade === cidade) : clientes
  const ativos = filtrados.filter((c) => c.status === 'ativo').length
  const inativos = filtrados.filter((c) => c.status === 'inativo').length
  const novos = filtrados.filter((c) => isInRange(c.dataCadastro, inicio, fim)).length

  const mesesMap = new Map<string, number>()
  for (const c of filtrados) {
    if (isInRange(c.dataCadastro, inicio, fim)) {
      const d = parseDate(c.dataCadastro)
      const key = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
      mesesMap.set(key, (mesesMap.get(key) || 0) + 1)
    }
  }
  const barData = Array.from(mesesMap.entries())
    .map(([mes, n]) => ({ mes, novos: n }))
    .sort((a, b) => {
      const [mA, yA] = a.mes.split('/').map(Number)
      const [mB, yB] = b.mes.split('/').map(Number)
      return new Date(yA, mA - 1).getTime() - new Date(yB, mB - 1).getTime()
    })

  const tabela = filtrados.map((c) => {
    const cv = vendas.filter((v) => v.cliente_id === c.id)
    return { ...c, totalGasto: cv.reduce((s, v) => s + v.total, 0), qtdPedidos: cv.length }
  })

  return {
    pieData: [
      { name: 'Ativos', value: ativos, fill: '#10B981' },
      { name: 'Inativos', value: inativos, fill: '#6B7280' },
    ],
    barData,
    tabela,
    totais: { totalClientes: filtrados.length, ativos, inativos, novos },
  }
}

// ─── 9. Ranking de Clientes ───────────────────────────────────────────────────

export interface RankingClienteItem {
  clienteId: string | null
  clienteNome: string
  status: string
  totalGasto: number
  qtdPedidos: number
  ticketMedio: number
  primeiraCompra: string | null
  ultimaCompra: string | null
}

export interface RankingClientesResult {
  dados: RankingClienteItem[]
  totais: {
    top1Nome: string
    top1Valor: number
    totalCadastrados: number
    pctRecorrentes: number
  }
}

export function calcularRankingClientes(
  vendas: Venda[],
  clientes: Cliente[],
  inicio: Date,
  fim: Date,
  ordenarPor: 'valor' | 'pedidos' | 'recente',
  top: number | 'todos'
): RankingClientesResult {
  const filtradas = vendas.filter(
    (v) => isInRange(v.criado_em, inicio, fim) && !INACTIVE_STATUSES.includes(v.status)
  )
  const map = new Map<string, RankingClienteItem>()

  for (const v of filtradas) {
    const key = v.cliente_id || 'avulso'
    if (!map.has(key)) {
      const cli = clientes.find((c) => c.id === v.cliente_id)
      map.set(key, {
        clienteId: v.cliente_id,
        clienteNome: v.cliente_nome,
        status: cli?.status || 'avulso',
        totalGasto: 0,
        qtdPedidos: 0,
        ticketMedio: 0,
        primeiraCompra: v.criado_em,
        ultimaCompra: v.criado_em,
      })
    }
    const item = map.get(key)!
    item.totalGasto += v.total
    item.qtdPedidos++
    item.ultimaCompra = v.criado_em
  }
  for (const item of map.values()) {
    item.ticketMedio = item.qtdPedidos > 0 ? item.totalGasto / item.qtdPedidos : 0
  }

  let dados = Array.from(map.values())
  if (ordenarPor === 'valor') dados.sort((a, b) => b.totalGasto - a.totalGasto)
  else if (ordenarPor === 'pedidos') dados.sort((a, b) => b.qtdPedidos - a.qtdPedidos)
  else
    dados.sort((a, b) => {
      if (!a.ultimaCompra) return 1
      if (!b.ultimaCompra) return -1
      return parseDate(b.ultimaCompra).getTime() - parseDate(a.ultimaCompra).getTime()
    })

  if (top !== 'todos') dados = dados.slice(0, top)
  const comId = dados.filter((d) => d.clienteId)
  const recorrentes = comId.filter((d) => d.qtdPedidos >= 2).length

  return {
    dados,
    totais: {
      top1Nome: dados[0]?.clienteNome || '-',
      top1Valor: dados[0]?.totalGasto || 0,
      totalCadastrados: comId.reduce((s, d) => s + d.totalGasto, 0),
      pctRecorrentes: comId.length > 0 ? (recorrentes / comId.length) * 100 : 0,
    },
  }
}
