import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, DollarSign, Repeat } from 'lucide-react'
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
  calcularRankingClientes,
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
  ordenarPor: 'valor' as 'valor' | 'pedidos' | 'recente',
  top: 10 as number | 'todos',
}

function calcular(f: typeof DEFAULT) {
  const { inicio, fim } = getPeriodDates(f.periodo, f.dataInicio, f.dataFim)
  return calcularRankingClientes(vendasMock, clientesMock, inicio, fim, f.ordenarPor, f.top)
}

const MEDAL = ['🥇', '🥈', '🥉']

export function RankingClientes() {
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
      label: '1º Colocado',
      value: dados.totais.top1Nome.length > 18
        ? dados.totais.top1Nome.slice(0, 18) + '…'
        : dados.totais.top1Nome,
      sublabel: formatCurrency(dados.totais.top1Valor),
      color: 'amber' as const,
      icon: Crown,
    },
    {
      label: 'Faturado (Cadastrados)',
      value: formatCurrency(dados.totais.totalCadastrados),
      color: 'indigo' as const,
      icon: DollarSign,
    },
    {
      label: 'Faturado (Avulsos)',
      value: formatCurrency(
        dados.dados
          .filter((d) => !d.clienteId)
          .reduce((s, d) => s + d.totalGasto, 0)
      ),
      color: 'violet' as const,
      icon: DollarSign,
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
      key: 'pos',
      label: '#',
      render: (_: Record<string, unknown>, i: number) =>
        i < 3 ? (
          <span className="text-base">{MEDAL[i]}</span>
        ) : (
          <span className="text-white/40 text-xs">{i + 1}</span>
        ),
    },
    {
      key: 'clienteNome',
      label: 'Cliente',
      render: (row: Record<string, unknown>) => (
        <span className="text-white/80">{row.clienteNome as string}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: Record<string, unknown>) => {
        const s = row.status as string
        if (s === 'avulso') return <span className="text-xs text-white/30">Avulso</span>
        return (
          <span className={`inline-flex px-2 py-0.5 text-xs rounded-md border ${
            s === 'ativo'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
          }`}>
            {s === 'ativo' ? 'Ativo' : 'Inativo'}
          </span>
        )
      },
    },
    {
      key: 'totalGasto',
      label: 'Total Gasto',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => (
        <span className="text-indigo-300 font-medium">{formatCurrency(row.totalGasto as number)}</span>
      ),
    },
    { key: 'qtdPedidos', label: 'Qtd Pedidos', align: 'right' as const },
    {
      key: 'ticketMedio',
      label: 'Ticket Médio',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => formatCurrency(row.ticketMedio as number),
    },
    {
      key: 'primeiraCompra',
      label: 'Primeira Compra',
      render: (row: Record<string, unknown>) => {
        const v = row.primeiraCompra as string | null
        return v ? v.split(' ')[0] : '-'
      },
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

  const top10Chart = dados.dados.slice(0, 10).map((d) => ({
    nome: d.clienteNome.length > 14 ? d.clienteNome.slice(0, 14) + '…' : d.clienteNome,
    totalGasto: d.totalGasto,
  }))

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={20} className="text-amber-400" />
          <h2 className="text-xl font-bold text-white">Ranking de Clientes</h2>
        </div>
        <p className="text-sm text-white/40">
          Os clientes que mais contribuíram para o faturamento.
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
          label="Ordenar por"
          value={filtros.ordenarPor}
          onChange={(v) => setFiltros((f) => ({ ...f, ordenarPor: v as typeof DEFAULT.ordenarPor }))}
        >
          <option value="valor">Maior Valor</option>
          <option value="pedidos">Mais Pedidos</option>
          <option value="recente">Mais Recente</option>
        </FilterSelect>
        <FilterSelect
          label="Exibir"
          value={String(filtros.top)}
          onChange={(v) => setFiltros((f) => ({ ...f, top: v === 'todos' ? 'todos' : Number(v) }))}
        >
          <option value="5">Top 5</option>
          <option value="10">Top 10</option>
          <option value="todos">Todos</option>
        </FilterSelect>
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
                data={top10Chart}
                margin={{ top: 5, right: 30, bottom: 5, left: 120 }}
              >
                <defs>
                  <linearGradient id="rankingBar" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#06B6D4" />
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
                  dataKey="nome"
                  {...AXIS_PROPS}
                  width={115}
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
                  fill="url(#rankingBar)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </GraficoRelatorio>

          <TabelaRelatorio
            title="Ranking Completo"
            columns={colunas}
            data={dados.dados as unknown as Record<string, unknown>[]}
            emptyMessage="Nenhuma venda encontrada no período"
          />

          <ExportacaoRelatorio />
        </>
      )}
    </div>
  )
}
