import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Layers, CheckCircle, AlertTriangle, XCircle, Package } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import {
  calcularPosicaoEstoque,
  type StatusEstoque,
} from '@/utils/relatorios'
import { produtosMock } from '@/mocks/produtos'
import { estoqueProdutoMock } from '@/mocks/estoque_produto'
import { categoriasMock } from '@/mocks/categorias'
import { movimentacoesMock } from '@/mocks/movimentacoes_estoque'
import { FiltrosRelatorio, FilterSelect } from '../FiltrosRelatorio'
import { TotalizadoresRelatorio } from '../TotalizadoresRelatorio'
import { GraficoRelatorio, CustomTooltip, AXIS_PROPS, GRID_PROPS } from '../GraficoRelatorio'
import { TabelaRelatorio } from '../TabelaRelatorio'
import { ExportacaoRelatorio } from '../ExportacaoRelatorio'
import { SkeletonRelatorio } from '../SkeletonRelatorio'

const DEFAULT = {
  categoria: '',
  statusEstoque: 'todos',
  ordenarPor: 'nome',
}

function calcular(f: typeof DEFAULT) {
  return calcularPosicaoEstoque(
    produtosMock, estoqueProdutoMock, categoriasMock, movimentacoesMock,
    f.categoria, f.statusEstoque, f.ordenarPor
  )
}

const STATUS_CONFIG: Record<StatusEstoque, { label: string; color: string; badge: string }> = {
  normal: { label: 'Normal', color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  baixo: { label: 'Baixo', color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  critico: { label: 'Crítico', color: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  zerado: { label: 'Zerado', color: 'text-red-400', badge: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

export function PosicaoEstoque() {
  const [filtros, setFiltros] = useState(DEFAULT)
  const [dados, setDados] = useState(() => calcular(DEFAULT))
  const [loading, setLoading] = useState(false)

  const aplicar = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setDados(calcular(filtros))
      setLoading(false)
    }, 400)
  }, [filtros])

  const limpar = useCallback(() => {
    setFiltros(DEFAULT)
    setLoading(true)
    setTimeout(() => {
      setDados(calcular(DEFAULT))
      setLoading(false)
    }, 400)
  }, [])

  const totais = [
    {
      label: 'Total de Produtos',
      value: String(dados.totais.total),
      color: 'indigo' as const,
      icon: Package,
    },
    {
      label: 'Estoque Normal',
      value: String(dados.totais.normais),
      color: 'emerald' as const,
      icon: CheckCircle,
    },
    {
      label: 'Baixo / Crítico',
      value: String(dados.totais.baixoCritico),
      color: 'amber' as const,
      icon: AlertTriangle,
    },
    {
      label: 'Zerados',
      value: String(dados.totais.zerados),
      color: 'red' as const,
      icon: XCircle,
    },
  ]

  const colunas = [
    { key: 'produtoNome', label: 'Produto' },
    { key: 'sku', label: 'SKU', render: (row: Record<string, unknown>) => (
      <span className="text-xs text-white/40 font-mono">{row.sku as string}</span>
    )},
    { key: 'categoriaNome', label: 'Categoria' },
    { key: 'estoqueReal', label: 'Real', align: 'right' as const },
    { key: 'estoqueReservado', label: 'Reservado', align: 'right' as const },
    { key: 'estoqueDisponivel', label: 'Disponível', align: 'right' as const },
    { key: 'estoqueMinimo', label: 'Mínimo', align: 'right' as const },
    {
      key: 'status',
      label: 'Status',
      render: (row: Record<string, unknown>) => {
        const s = row.status as StatusEstoque
        const cfg = STATUS_CONFIG[s]
        return (
          <span className={`inline-flex px-2 py-0.5 text-xs rounded-md border ${cfg.badge}`}>
            {cfg.label}
          </span>
        )
      },
    },
  ]

  // Top 12 mais críticos para o gráfico
  const statusOrder: Record<StatusEstoque, number> = { zerado: 0, critico: 1, baixo: 2, normal: 3 }
  const chartData = [...dados.dados]
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
    .slice(0, 12)
    .map((d) => ({
      name: d.produtoNome.length > 12 ? d.produtoNome.slice(0, 12) + '…' : d.produtoNome,
      Real: d.estoqueReal,
      Mínimo: d.estoqueMinimo,
      Disponível: d.estoqueDisponivel,
    }))

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <div className="flex items-center gap-2 mb-1">
          <Layers size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Posição Atual do Estoque</h2>
        </div>
        <p className="text-sm text-white/40">
          Visão completa do estoque atual com status de cada produto.
        </p>
      </motion.div>

      <FiltrosRelatorio onAplicar={aplicar} onLimpar={limpar}>
        <FilterSelect
          label="Categoria"
          value={filtros.categoria}
          onChange={(v) => setFiltros((f) => ({ ...f, categoria: v }))}
        >
          <option value="">Todas</option>
          {categoriasMock.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="Status de Estoque"
          value={filtros.statusEstoque}
          onChange={(v) => setFiltros((f) => ({ ...f, statusEstoque: v }))}
        >
          <option value="todos">Todos</option>
          <option value="normal">Normal</option>
          <option value="baixo">Baixo</option>
          <option value="critico">Crítico</option>
          <option value="zerado">Zerado</option>
        </FilterSelect>
        <FilterSelect
          label="Ordenar por"
          value={filtros.ordenarPor}
          onChange={(v) => setFiltros((f) => ({ ...f, ordenarPor: v }))}
        >
          <option value="nome">Nome</option>
          <option value="estoque_atual">Estoque Atual</option>
          <option value="estoque_minimo">Estoque Mínimo</option>
          <option value="ultima_movimentacao">Última Movimentação</option>
        </FilterSelect>
      </FiltrosRelatorio>

      {loading ? (
        <SkeletonRelatorio />
      ) : (
        <>
          <TotalizadoresRelatorio items={totais} />

          <GraficoRelatorio title="Posição do Estoque (Top 12 mais críticos)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 40, left: 10 }}>
                <CartesianGrid {...GRID_PROPS} />
                <XAxis
                  dataKey="name"
                  {...AXIS_PROPS}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis {...AXIS_PROPS} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF', paddingTop: 8 }} />
                <ReferenceLine y={0} stroke="#ffffff20" />
                <Bar dataKey="Real" fill="#4F46E5" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Mínimo" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Disponível" fill="#06B6D4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GraficoRelatorio>

          <TabelaRelatorio
            title="Inventário Completo"
            columns={colunas}
            data={dados.dados as unknown as Record<string, unknown>[]}
            emptyMessage="Nenhum produto encontrado"
          />

          <ExportacaoRelatorio />
        </>
      )}
    </div>
  )
}
