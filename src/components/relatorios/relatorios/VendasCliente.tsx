import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { User, Users, TrendingUp, Repeat } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import {
  calcularVendasPorCliente,
  formatCurrency,
  getPeriodDates,
  type PeriodoOpcao,
} from '@/utils/relatorios'
import { vendasMock } from '@/mocks/vendas'
import { clientesMock } from '@/mocks/clientes'
import { FiltrosRelatorio, PeriodoSelect, PeriodoPersonalizado, FilterSelect } from '../FiltrosRelatorio'
import { TotalizadoresRelatorio } from '../TotalizadoresRelatorio'
import { GraficoRelatorio, CustomTooltip, AXIS_PROPS, GRID_PROPS } from '../GraficoRelatorio'
import { TabelaRelatorio } from '../TabelaRelatorio'
import { ExportacaoRelatorio } from '../ExportacaoRelatorio'
import { SkeletonRelatorio } from '../SkeletonRelatorio'

const DEFAULT = {
  periodo: 'mes' as PeriodoOpcao,
  dataInicio: '',
  dataFim: '',
  statusCliente: 'todos' as 'todos' | 'ativos' | 'inativos',
  incluirAvulsos: true,
  ordenarPor: 'valor' as 'valor' | 'quantidade' | 'recente',
}

function calcular(f: typeof DEFAULT) {
  const { inicio, fim } = getPeriodDates(f.periodo, f.dataInicio, f.dataFim)
  return calcularVendasPorCliente(
    vendasMock, clientesMock, inicio, fim,
    f.statusCliente, f.incluirAvulsos, f.ordenarPor
  )
}

const MEDAL = ['🥇', '🥈', '🥉']

export function VendasCliente() {
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
      label: 'Clientes que Compraram',
      value: String(dados.totais.totalClientes),
      color: 'indigo' as const,
      icon: Users,
    },
    {
      label: 'Top Cliente',
      value: dados.totais.clienteTop,
      color: 'cyan' as const,
      icon: User,
    },
    {
      label: 'Média por Cliente',
      value: formatCurrency(dados.totais.mediaCompras),
      color: 'violet' as const,
      icon: TrendingUp,
    },
    {
      label: '% Recorrentes',
      value: `${dados.totais.pctRecorrentes.toFixed(0)}%`,
      sublabel: 'compraram 2x ou mais',
      color: 'emerald' as const,
      icon: Repeat,
    },
  ]

  const colunas = [
    {
      key: 'posicao',
      label: '#',
      render: (_: Record<string, unknown>, i: number) => (
        <span>{MEDAL[i] || <span className="text-white/40 text-xs">{i + 1}</span>}</span>
      ),
    },
    { key: 'clienteNome', label: 'Cliente' },
    { key: 'qtdPedidos', label: 'Qtd Pedidos', align: 'right' as const },
    {
      key: 'totalGasto',
      label: 'Total Gasto',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => formatCurrency(row.totalGasto as number),
    },
    {
      key: 'ticketMedio',
      label: 'Ticket Médio',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => formatCurrency(row.ticketMedio as number),
    },
    {
      key: 'ultimaCompra',
      label: 'Última Compra',
      render: (row: Record<string, unknown>) => {
        const v = row.ultimaCompra as string | null
        return v ? v.split(' ')[0] : '-'
      },
    },
  ]

  const top10 = dados.dados.slice(0, 10)

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <div className="flex items-center gap-2 mb-1">
          <User size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Vendas por Cliente</h2>
        </div>
        <p className="text-sm text-white/40">
          Análise das vendas agrupadas por cliente no período.
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
          label="Status Cliente"
          value={filtros.statusCliente}
          onChange={(v) => setFiltros((f) => ({ ...f, statusCliente: v as typeof DEFAULT.statusCliente }))}
        >
          <option value="todos">Todos</option>
          <option value="ativos">Ativos</option>
          <option value="inativos">Inativos</option>
        </FilterSelect>
        <FilterSelect
          label="Ordenar por"
          value={filtros.ordenarPor}
          onChange={(v) => setFiltros((f) => ({ ...f, ordenarPor: v as typeof DEFAULT.ordenarPor }))}
        >
          <option value="valor">Maior Valor</option>
          <option value="quantidade">Maior Quantidade</option>
          <option value="recente">Mais Recente</option>
        </FilterSelect>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40">Vendas Avulsas</label>
          <button
            onClick={() => setFiltros((f) => ({ ...f, incluirAvulsos: !f.incluirAvulsos }))}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              filtros.incluirAvulsos ? 'bg-indigo-500' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                filtros.incluirAvulsos ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </FiltrosRelatorio>

      {loading ? (
        <SkeletonRelatorio />
      ) : (
        <>
          <TotalizadoresRelatorio items={totais} />

          <GraficoRelatorio title="Top 10 Clientes por Valor">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={top10}
                margin={{ top: 5, right: 30, bottom: 5, left: 120 }}
              >
                <defs>
                  <linearGradient id="clienteBar" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID_PROPS} horizontal={false} vertical />
                <XAxis
                  type="number"
                  {...AXIS_PROPS}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="clienteNome"
                  {...AXIS_PROPS}
                  width={115}
                  tickFormatter={(v: string) => (v.length > 16 ? v.slice(0, 16) + '…' : v)}
                />
                <Tooltip
                  content={
                    <CustomTooltip
                      formatValue={(_, v) => formatCurrency(v)}
                    />
                  }
                />
                <Bar
                  dataKey="totalGasto"
                  name="Total Gasto"
                  fill="url(#clienteBar)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </GraficoRelatorio>

          <TabelaRelatorio
            title="Ranking de Clientes"
            columns={colunas}
            data={dados.dados as unknown as Record<string, unknown>[]}
            emptyMessage="Nenhum cliente encontrado no período"
          />

          <ExportacaoRelatorio />
        </>
      )}
    </div>
  )
}
