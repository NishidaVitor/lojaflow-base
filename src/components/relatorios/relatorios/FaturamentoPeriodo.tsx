import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, ShoppingCart, Receipt, Award } from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { StatusVenda } from '@/types/venda'
import {
  calcularFaturamentoPorPeriodo,
  formatCurrency,
  getPeriodDates,
  type PeriodoOpcao,
} from '@/utils/relatorios'
import { vendasMock } from '@/mocks/vendas'
import { FiltrosRelatorio, PeriodoSelect, PeriodoPersonalizado } from '../FiltrosRelatorio'
import { TotalizadoresRelatorio } from '../TotalizadoresRelatorio'
import { GraficoRelatorio, CustomTooltip, AXIS_PROPS, GRID_PROPS } from '../GraficoRelatorio'
import { TabelaRelatorio } from '../TabelaRelatorio'
import { ExportacaoRelatorio } from '../ExportacaoRelatorio'
import { SkeletonRelatorio } from '../SkeletonRelatorio'

const STATUS_OPTIONS: { id: StatusVenda; label: string }[] = [
  { id: 'confirmada', label: 'Confirmada' },
  { id: 'em_separacao', label: 'Em Separação' },
  { id: 'entregue', label: 'Entregue' },
  { id: 'orcamento', label: 'Orçamento' },
  { id: 'cancelada', label: 'Cancelada' },
  { id: 'devolvida', label: 'Devolvida' },
]

const DEFAULT = {
  periodo: 'mes' as PeriodoOpcao,
  dataInicio: '',
  dataFim: '',
  status: ['confirmada', 'entregue', 'em_separacao'] as StatusVenda[],
}

function calcular(f: typeof DEFAULT) {
  const { inicio, fim } = getPeriodDates(f.periodo, f.dataInicio, f.dataFim)
  return calcularFaturamentoPorPeriodo(vendasMock, inicio, fim, f.status)
}

export function FaturamentoPeriodo() {
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

  const toggleStatus = (s: StatusVenda) => {
    setFiltros((prev) => ({
      ...prev,
      status: prev.status.includes(s)
        ? prev.status.filter((x) => x !== s)
        : [...prev.status, s],
    }))
  }

  const totais = [
    {
      label: 'Total Faturado',
      value: formatCurrency(dados.totais.totalFaturado),
      color: 'cyan' as const,
      icon: DollarSign,
    },
    {
      label: 'Qtd Vendas',
      value: String(dados.totais.quantidadeVendas),
      color: 'indigo' as const,
      icon: ShoppingCart,
    },
    {
      label: 'Ticket Médio',
      value: formatCurrency(dados.totais.ticketMedio),
      color: 'violet' as const,
      icon: Receipt,
    },
    {
      label: 'Maior Venda',
      value: formatCurrency(dados.totais.maiorVenda),
      color: 'emerald' as const,
      icon: Award,
    },
  ]

  const colunas = [
    { key: 'data', label: 'Data' },
    {
      key: 'quantidade',
      label: 'Qtd Vendas',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => String(row.quantidade),
    },
    {
      key: 'faturamento',
      label: 'Faturamento',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => formatCurrency(row.faturamento as number),
    },
    {
      key: 'ticketMedio',
      label: 'Ticket Médio',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => formatCurrency(row.ticketMedio as number),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Faturamento por Período</h2>
        </div>
        <p className="text-sm text-white/40">
          Evolução do faturamento e quantidade de vendas no período selecionado.
        </p>
      </motion.div>

      {/* Filtros */}
      <FiltrosRelatorio onAplicar={aplicar} onLimpar={limpar}>
        <PeriodoSelect
          value={filtros.periodo}
          onChange={(v) => setFiltros((f) => ({ ...f, periodo: v }))}
        />
        {filtros.periodo === 'personalizado' && (
          <PeriodoPersonalizado
            inicio={filtros.dataInicio}
            fim={filtros.dataFim}
            onChangeInicio={(v) => setFiltros((f) => ({ ...f, dataInicio: v }))}
            onChangeFim={(v) => setFiltros((f) => ({ ...f, dataFim: v }))}
          />
        )}
        <div>
          <label className="text-xs text-white/40 block mb-1">Status</label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleStatus(s.id)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  filtros.status.includes(s.id)
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : 'border-white/10 text-white/40 hover:border-white/20'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </FiltrosRelatorio>

      {loading ? (
        <SkeletonRelatorio />
      ) : (
        <>
          {/* Totalizadores */}
          <TotalizadoresRelatorio items={totais} />

          {/* Gráfico */}
          <GraficoRelatorio title="Faturamento Diário">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dados.grafico}>
                <defs>
                  <linearGradient id="fillFat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillQtd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID_PROPS} />
                <XAxis
                  dataKey="data"
                  {...AXIS_PROPS}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  {...AXIS_PROPS}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis yAxisId="right" orientation="right" {...AXIS_PROPS} />
                <Tooltip
                  content={
                    <CustomTooltip
                      formatValue={(name, value) =>
                        name === 'Faturamento' ? formatCurrency(value) : String(value)
                      }
                    />
                  }
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: '#9CA3AF', paddingTop: 8 }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="faturamento"
                  name="Faturamento"
                  stroke="#4F46E5"
                  fill="url(#fillFat)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#4F46E5' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="quantidade"
                  name="Qtd Vendas"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#7C3AED' }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </GraficoRelatorio>

          {/* Tabela */}
          <TabelaRelatorio
            title="Detalhamento por Dia"
            columns={colunas}
            data={dados.tabela as unknown as Record<string, unknown>[]}
            emptyMessage="Nenhuma venda no período selecionado"
          />

          {/* Exportação */}
          <ExportacaoRelatorio />
        </>
      )}
    </div>
  )
}
