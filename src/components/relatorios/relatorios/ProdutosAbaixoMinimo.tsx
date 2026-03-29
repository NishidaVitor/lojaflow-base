import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, XCircle, Zap, Layers } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'
import {
  calcularProdutosAbaixoMinimo,
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
  criticidade: 'todos' as 'todos' | 'criticos' | 'zerados',
  ordenarPor: 'criticidade' as 'criticidade' | 'categoria' | 'nome',
}

function calcular(f: typeof DEFAULT) {
  return calcularProdutosAbaixoMinimo(
    produtosMock, estoqueProdutoMock, categoriasMock, movimentacoesMock,
    f.categoria, f.criticidade, f.ordenarPor
  )
}

const STATUS_CONFIG: Record<StatusEstoque, { badge: string; rowBg: string }> = {
  normal: { badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', rowBg: '' },
  baixo: { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', rowBg: '' },
  critico: { badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', rowBg: 'bg-orange-500/5' },
  zerado: { badge: 'bg-red-500/20 text-red-400 border-red-500/30', rowBg: 'bg-red-500/5' },
}

const STATUS_LABEL: Record<StatusEstoque, string> = {
  normal: 'Normal', baixo: 'Baixo', critico: 'Crítico', zerado: 'Zerado'
}

const BAR_COLORS: Record<StatusEstoque, string> = {
  zerado: '#EF4444', critico: '#F97316', baixo: '#F59E0B', normal: '#10B981'
}

export function ProdutosAbaixoMinimo() {
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
      label: 'Total Abaixo do Mínimo',
      value: String(dados.totais.totalAbaixo),
      color: 'red' as const,
      icon: AlertTriangle,
    },
    {
      label: 'Produtos Zerados',
      value: String(dados.totais.zerados),
      color: 'red' as const,
      icon: XCircle,
    },
    {
      label: 'Estoque Crítico',
      value: String(dados.totais.criticos),
      color: 'amber' as const,
      icon: Zap,
    },
    {
      label: 'Categorias Afetadas',
      value: String(dados.totais.categoriasAfetadas),
      color: 'violet' as const,
      icon: Layers,
    },
  ]

  const colunas = [
    { key: 'produtoNome', label: 'Produto' },
    { key: 'categoriaNome', label: 'Categoria' },
    { key: 'estoqueDisponivel', label: 'Disponível', align: 'right' as const },
    { key: 'estoqueMinimo', label: 'Mínimo', align: 'right' as const },
    {
      key: 'deficit',
      label: 'Déficit',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => (
        <span className="text-red-400 font-medium">{String(row.deficit)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: Record<string, unknown>) => {
        const s = row.status as StatusEstoque
        const cfg = STATUS_CONFIG[s]
        return (
          <span className={`inline-flex px-2 py-0.5 text-xs rounded-md border ${cfg.badge}`}>
            {STATUS_LABEL[s]}
          </span>
        )
      },
    },
    {
      key: 'ultimaEntrada',
      label: 'Última Entrada',
      render: (row: Record<string, unknown>) => {
        const v = row.ultimaEntrada as string
        return v === '-' ? '-' : v.split(' ')[0]
      },
    },
  ]

  const chartData = dados.dados.map((d) => ({
    name: d.produtoNome.length > 14 ? d.produtoNome.slice(0, 14) + '…' : d.produtoNome,
    Disponível: d.estoqueDisponivel,
    Mínimo: d.estoqueMinimo,
    _status: d.status,
  }))

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={20} className="text-red-400" />
          <h2 className="text-xl font-bold text-white">Produtos Abaixo do Mínimo</h2>
        </div>
        <p className="text-sm text-white/40">
          Produtos que precisam de reposição imediata.
        </p>
      </motion.div>

      {/* Banner de alerta */}
      {dados.totais.totalAbaixo > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl"
        >
          <AlertTriangle size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300">
            <span className="font-semibold">{dados.totais.totalAbaixo} produto(s)</span>{' '}
            precisam de reposição imediata.
          </p>
        </motion.div>
      )}

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
          label="Criticidade"
          value={filtros.criticidade}
          onChange={(v) => setFiltros((f) => ({ ...f, criticidade: v as typeof DEFAULT.criticidade }))}
        >
          <option value="todos">Todos Abaixo</option>
          <option value="criticos">Apenas Críticos</option>
          <option value="zerados">Apenas Zerados</option>
        </FilterSelect>
        <FilterSelect
          label="Ordenar por"
          value={filtros.ordenarPor}
          onChange={(v) => setFiltros((f) => ({ ...f, ordenarPor: v as typeof DEFAULT.ordenarPor }))}
        >
          <option value="criticidade">Mais Crítico</option>
          <option value="categoria">Categoria</option>
          <option value="nome">Nome</option>
        </FilterSelect>
      </FiltrosRelatorio>

      {loading ? (
        <SkeletonRelatorio />
      ) : (
        <>
          <TotalizadoresRelatorio items={totais} />

          <GraficoRelatorio title="Disponível vs Mínimo">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 30, bottom: 5, left: 130 }}
              >
                <CartesianGrid {...GRID_PROPS} horizontal={false} vertical />
                <XAxis type="number" {...AXIS_PROPS} />
                <YAxis
                  type="category"
                  dataKey="name"
                  {...AXIS_PROPS}
                  width={125}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF', paddingTop: 8 }} />
                <Bar dataKey="Disponível" radius={[0, 4, 4, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={BAR_COLORS[d._status as StatusEstoque]} />
                  ))}
                </Bar>
                <Bar dataKey="Mínimo" fill="#6B7280" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GraficoRelatorio>

          <TabelaRelatorio
            title="Produtos que Precisam de Reposição"
            columns={colunas}
            data={dados.dados as unknown as Record<string, unknown>[]}
            emptyMessage="Nenhum produto abaixo do mínimo"
          />

          <ExportacaoRelatorio />
        </>
      )}
    </div>
  )
}
