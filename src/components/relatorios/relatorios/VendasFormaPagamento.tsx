import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, ShoppingCart, DollarSign, Percent, BarChart2, PieChart as PieIcon } from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import {
  calcularVendasPorFormaPagamento,
  formatCurrency,
  getPeriodDates,
  type PeriodoOpcao,
} from '@/utils/relatorios'
import { vendasMock } from '@/mocks/vendas'
import { FiltrosRelatorio, PeriodoSelect, PeriodoPersonalizado, FilterSelect } from '../FiltrosRelatorio'
import { TotalizadoresRelatorio } from '../TotalizadoresRelatorio'
import { GraficoRelatorio, CustomTooltip, CHART_COLORS, AXIS_PROPS, GRID_PROPS } from '../GraficoRelatorio'
import { TabelaRelatorio } from '../TabelaRelatorio'
import { ExportacaoRelatorio } from '../ExportacaoRelatorio'
import { SkeletonRelatorio } from '../SkeletonRelatorio'

const DEFAULT = {
  periodo: 'mes' as PeriodoOpcao,
  dataInicio: '',
  dataFim: '',
  agrupamento: 'valor' as 'valor' | 'quantidade',
}

function calcular(f: typeof DEFAULT) {
  const { inicio, fim } = getPeriodDates(f.periodo, f.dataInicio, f.dataFim)
  return calcularVendasPorFormaPagamento(vendasMock, inicio, fim)
}

export function VendasFormaPagamento() {
  const [filtros, setFiltros] = useState(DEFAULT)
  const [dados, setDados] = useState(() => calcular(DEFAULT))
  const [loading, setLoading] = useState(false)
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie')

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
      label: 'Forma Mais Usada',
      value: dados.totais.formaMaisUsada,
      color: 'indigo' as const,
      icon: CreditCard,
    },
    {
      label: 'Maior Valor',
      value: dados.totais.formaComMaiorValor,
      color: 'cyan' as const,
      icon: DollarSign,
    },
    {
      label: 'Total de Vendas',
      value: String(dados.totais.totalVendas),
      color: 'violet' as const,
      icon: ShoppingCart,
    },
    {
      label: '% À Vista',
      value: `${dados.totais.pctAVista.toFixed(0)}%`,
      sublabel: `${(100 - dados.totais.pctAVista).toFixed(0)}% parcelado`,
      color: 'emerald' as const,
      icon: Percent,
    },
  ]

  const colunas = [
    { key: 'label', label: 'Forma de Pagamento' },
    { key: 'qtdVendas', label: 'Qtd Vendas', align: 'right' as const },
    {
      key: 'pctVendas',
      label: '% Vendas',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => `${(row.pctVendas as number).toFixed(1)}%`,
    },
    {
      key: 'totalValor',
      label: 'Total R$',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => formatCurrency(row.totalValor as number),
    },
    {
      key: 'pctValor',
      label: '% Valor',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => `${(row.pctValor as number).toFixed(1)}%`,
    },
    {
      key: 'ticketMedio',
      label: 'Ticket Médio',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => formatCurrency(row.ticketMedio as number),
    },
  ]

  const chartToggle = (
    <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
      <button
        onClick={() => setChartType('pie')}
        className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
          chartType === 'pie' ? 'bg-indigo-500/30 text-indigo-300' : 'text-white/40 hover:text-white/60'
        }`}
      >
        <PieIcon size={12} />
        Pizza
      </button>
      <button
        onClick={() => setChartType('bar')}
        className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
          chartType === 'bar' ? 'bg-indigo-500/30 text-indigo-300' : 'text-white/40 hover:text-white/60'
        }`}
      >
        <BarChart2 size={12} />
        Barras
      </button>
    </div>
  )

  const barDataKey = filtros.agrupamento === 'valor' ? 'totalValor' : 'qtdVendas'
  const barName = filtros.agrupamento === 'valor' ? 'Valor Total' : 'Qtd Vendas'

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <div className="flex items-center gap-2 mb-1">
          <CreditCard size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Vendas por Forma de Pagamento</h2>
        </div>
        <p className="text-sm text-white/40">
          Distribuição das vendas por forma de pagamento no período.
        </p>
      </motion.div>

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
        <FilterSelect
          label="Agrupar por"
          value={filtros.agrupamento}
          onChange={(v) => setFiltros((f) => ({ ...f, agrupamento: v as 'valor' | 'quantidade' }))}
        >
          <option value="valor">Valor Total</option>
          <option value="quantidade">Quantidade de Vendas</option>
        </FilterSelect>
      </FiltrosRelatorio>

      {loading ? (
        <SkeletonRelatorio />
      ) : (
        <>
          <TotalizadoresRelatorio items={totais} />

          <GraficoRelatorio
            title={chartType === 'pie' ? 'Distribuição por Forma de Pagamento' : 'Valor por Forma de Pagamento'}
            actions={chartToggle}
          >
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={dados.dados}
                    dataKey="pctVendas"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, pctVendas }) => `${name}: ${pctVendas.toFixed(0)}%`}
                    labelLine={{ stroke: '#9CA3AF' }}
                  >
                    {dados.dados.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <CustomTooltip
                        formatValue={(_, v) => `${v.toFixed(1)}%`}
                      />
                    }
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF', paddingTop: 8 }} />
                </PieChart>
              ) : (
                <BarChart data={dados.dados} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                  <CartesianGrid {...GRID_PROPS} />
                  <XAxis dataKey="label" {...AXIS_PROPS} />
                  <YAxis
                    {...AXIS_PROPS}
                    tickFormatter={(v) =>
                      filtros.agrupamento === 'valor' ? `R$${(v / 1000).toFixed(0)}k` : String(v)
                    }
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        formatValue={(_, v) =>
                          filtros.agrupamento === 'valor' ? formatCurrency(v) : String(v)
                        }
                      />
                    }
                  />
                  <Bar dataKey={barDataKey} name={barName} fill="#4F46E5" radius={[4, 4, 0, 0]}>
                    {dados.dados.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </GraficoRelatorio>

          <TabelaRelatorio
            title="Detalhamento por Forma de Pagamento"
            columns={colunas}
            data={dados.dados as unknown as Record<string, unknown>[]}
            emptyMessage="Nenhuma venda no período selecionado"
          />

          <ExportacaoRelatorio />
        </>
      )}
    </div>
  )
}
