import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Users, UserCheck, UserX, UserPlus } from 'lucide-react'
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
  calcularClientesPorStatus,
  formatCurrency,
  getPeriodDates,
  type PeriodoOpcao,
} from '@/utils/relatorios'
import { clientesMock } from '@/mocks/clientes'
import { vendasMock } from '@/mocks/vendas'
import { FiltrosRelatorio, PeriodoSelect, PeriodoPersonalizado, FilterSelect } from '../FiltrosRelatorio'
import { TotalizadoresRelatorio } from '../TotalizadoresRelatorio'
import { GraficoRelatorio, CustomTooltip, AXIS_PROPS, GRID_PROPS } from '../GraficoRelatorio'
import { TabelaRelatorio } from '../TabelaRelatorio'
import { ExportacaoRelatorio } from '../ExportacaoRelatorio'
import { SkeletonRelatorio } from '../SkeletonRelatorio'

const DEFAULT = {
  periodo: 'ano' as PeriodoOpcao,
  dataInicio: '',
  dataFim: '',
  cidade: '',
}

function calcular(f: typeof DEFAULT) {
  const { inicio, fim } = getPeriodDates(f.periodo, f.dataInicio, f.dataFim)
  return calcularClientesPorStatus(clientesMock, vendasMock, inicio, fim, f.cidade)
}

const cidades = [...new Set(clientesMock.map((c) => c.cidade))].sort()

export function ClientesPorStatus() {
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
      label: 'Total de Clientes',
      value: String(dados.totais.totalClientes),
      color: 'indigo' as const,
      icon: Users,
    },
    {
      label: 'Ativos',
      value: String(dados.totais.ativos),
      color: 'emerald' as const,
      icon: UserCheck,
    },
    {
      label: 'Inativos',
      value: String(dados.totais.inativos),
      color: 'violet' as const,
      icon: UserX,
    },
    {
      label: 'Novos no Período',
      value: String(dados.totais.novos),
      color: 'cyan' as const,
      icon: UserPlus,
    },
  ]

  const colunas = [
    { key: 'nome', label: 'Nome' },
    {
      key: 'status',
      label: 'Status',
      render: (row: Record<string, unknown>) => {
        const s = row.status as string
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
      render: (row: Record<string, unknown>) => formatCurrency(row.totalGasto as number),
    },
    { key: 'qtdPedidos', label: 'Qtd Pedidos', align: 'right' as const },
    {
      key: 'dataCadastro',
      label: 'Cadastrado em',
    },
    {
      key: 'ultimaCompra',
      label: 'Última Compra',
    },
  ]

  const PIE_COLORS = ['#10B981', '#6B7280']

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <div className="flex items-center gap-2 mb-1">
          <Users size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Clientes por Status</h2>
        </div>
        <p className="text-sm text-white/40">
          Distribuição e evolução da base de clientes.
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
          label="Cidade"
          value={filtros.cidade}
          onChange={(v) => setFiltros((f) => ({ ...f, cidade: v }))}
        >
          <option value="">Todas</option>
          {cidades.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </FilterSelect>
      </FiltrosRelatorio>

      {loading ? (
        <SkeletonRelatorio />
      ) : (
        <>
          <TotalizadoresRelatorio items={totais} />

          {/* Gráficos lado a lado */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Pie Chart */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <p className="text-sm font-semibold text-white/70 mb-4">Ativos vs Inativos</p>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dados.pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={{ stroke: '#9CA3AF' }}
                    >
                      {dados.pieData.map((entry, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart — novos cadastros por mês */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <p className="text-sm font-semibold text-white/70 mb-4">Novos Cadastros por Mês</p>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  {dados.barData.length > 0 ? (
                    <BarChart data={dados.barData}>
                      <CartesianGrid {...GRID_PROPS} />
                      <XAxis dataKey="mes" {...AXIS_PROPS} />
                      <YAxis {...AXIS_PROPS} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="novos" name="Novos" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-white/30 text-sm">Nenhum cadastro no período</p>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <TabelaRelatorio
            title="Lista de Clientes"
            columns={colunas}
            data={dados.tabela as unknown as Record<string, unknown>[]}
            emptyMessage="Nenhum cliente encontrado"
          />

          <ExportacaoRelatorio />
        </>
      )}
    </div>
  )
}
