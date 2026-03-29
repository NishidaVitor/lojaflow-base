import { clientesMock } from '@/mocks/clientes'
import { produtosMock } from '@/mocks/produtos'
import { vendasMock } from '@/mocks/vendas'
import { movimentacoesMock } from '@/mocks/movimentacoes_estoque'
import { categoriasMock } from '@/mocks/categorias'
import { estoqueProdutoMock } from '@/mocks/estoque_produto'
import { getStatusEstoque } from '@/utils/estoque'
import type { ResultadoBusca } from '@/types/busca'

function scoreField(text: string, term: string): number {
  const t = text.toLowerCase()
  const s = term.toLowerCase()
  if (t === s) return 3
  if (t.startsWith(s)) return 2
  if (t.includes(s)) return 1
  return 0
}

function maxScore(fields: (string | null | undefined)[], term: string): number {
  return Math.max(0, ...fields.map((f) => (f ? scoreField(f, term) : 0)))
}

const STATUS_VENDA: Record<string, { texto: string; cor: string }> = {
  orcamento: { texto: 'Orçamento', cor: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  confirmada: { texto: 'Confirmada', cor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  em_separacao: { texto: 'Em separação', cor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  entregue: { texto: 'Entregue', cor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  cancelada: { texto: 'Cancelada', cor: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

const STATUS_ESTOQUE: Record<string, { texto: string; cor: string }> = {
  normal: { texto: 'Normal', cor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  baixo: { texto: 'Baixo', cor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  critico: { texto: 'Crítico', cor: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  zerado: { texto: 'Zerado', cor: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

export function buscarGlobal(termo: string): ResultadoBusca[] {
  const t = termo.trim()
  if (t.length < 2) return []

  const resultados: ResultadoBusca[] = []

  // ── Clientes ────────────────────────────────────────────────────
  const clientes = clientesMock
    .filter((c) =>
      [c.nome, c.telefone, c.email ?? '', c.cidade].some((f) =>
        f.toLowerCase().includes(t.toLowerCase())
      )
    )
    .map((c) => ({ item: c, score: maxScore([c.nome, c.telefone, c.email, c.cidade], t) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item: c }): ResultadoBusca => ({
      id: c.id,
      tipo: 'cliente',
      icone_cor: '#06B6D4',
      titulo: c.nome,
      subtitulo: `${c.telefone} · ${c.cidade}`,
      rota: `/clientes/${c.id}`,
      badge_texto: c.status === 'ativo' ? 'Ativo' : 'Inativo',
      badge_cor:
        c.status === 'ativo'
          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          : 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    }))
  resultados.push(...clientes)

  // ── Produtos ────────────────────────────────────────────────────
  const produtos = produtosMock
    .filter((p) =>
      [p.nome, p.sku, p.marca ?? '', p.descricao ?? ''].some((f) =>
        f.toLowerCase().includes(t.toLowerCase())
      )
    )
    .map((p) => ({ item: p, score: maxScore([p.nome, p.sku, p.marca, p.descricao], t) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item: p }): ResultadoBusca => {
      const categoria = categoriasMock.find((c) => c.id === p.categoria_id)
      const estoque = estoqueProdutoMock.find((e) => e.produto_id === p.id)
      const status = estoque ? getStatusEstoque(estoque) : 'normal'
      const st = STATUS_ESTOQUE[status]
      return {
        id: p.id,
        tipo: 'produto',
        icone_cor: '#7C3AED',
        titulo: p.nome,
        subtitulo: `${p.sku} · ${categoria?.nome ?? 'Sem categoria'}`,
        rota: `/produtos/${p.id}`,
        badge_texto: st.texto,
        badge_cor: st.cor,
        thumbnail: p.imagem_url ?? undefined,
      }
    })
  resultados.push(...produtos)

  // ── Vendas ──────────────────────────────────────────────────────
  const vendas = vendasMock
    .filter((v) =>
      [v.numero, v.cliente_nome].some((f) =>
        f.toLowerCase().includes(t.toLowerCase())
      )
    )
    .map((v) => ({ item: v, score: maxScore([v.numero, v.cliente_nome], t) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item: v }): ResultadoBusca => {
      const sv = STATUS_VENDA[v.status] ?? STATUS_VENDA.orcamento
      return {
        id: v.id,
        tipo: 'venda',
        icone_cor: '#4F46E5',
        titulo: `${v.numero} — ${v.cliente_nome}`,
        subtitulo: `R$ ${v.total.toFixed(2).replace('.', ',')} · ${v.criado_em.split(' ')[0]}`,
        rota: `/vendas/${v.id}`,
        badge_texto: sv.texto,
        badge_cor: sv.cor,
      }
    })
  resultados.push(...vendas)

  // ── Movimentações ───────────────────────────────────────────────
  const movs = movimentacoesMock
    .filter((m) =>
      [m.referencia_numero ?? '', m.motivo, m.cliente_nome ?? '', m.fornecedor_nome ?? ''].some(
        (f) => f.toLowerCase().includes(t.toLowerCase())
      )
    )
    .map((m) => ({
      item: m,
      score: maxScore(
        [m.referencia_numero, m.motivo, m.cliente_nome, m.fornecedor_nome],
        t
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item: m }): ResultadoBusca => {
      const produto = produtosMock.find((p) => p.id === m.produto_id)
      const op = m.operacao === 'entrada' ? 'Entrada' : 'Saída'
      return {
        id: m.id,
        tipo: 'movimentacao',
        icone_cor: '#10B981',
        titulo: `${op} — ${produto?.nome ?? 'Produto'}`,
        subtitulo:
          m.motivo.length > 50 ? m.motivo.slice(0, 50) + '…' : m.motivo,
        rota: `/produtos/${m.produto_id}`,
        badge_texto: op,
        badge_cor:
          m.operacao === 'entrada'
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            : 'bg-red-500/20 text-red-400 border-red-500/30',
      }
    })
  resultados.push(...movs)

  return resultados.slice(0, 10)
}
