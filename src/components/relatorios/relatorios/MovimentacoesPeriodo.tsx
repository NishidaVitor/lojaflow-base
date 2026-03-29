import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, ArrowDown, ArrowUp, Package } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import {
  calcularMovimentacoesPeriodo,
  getPeriodDates,
  type PeriodoOpcao,
  type MovimentacaoEstoque,
} from '@/utils/relatorios'
import { movimentacoesMock } from '@/mocks/movimentacoes_estoque'
import { produtosMock } from '@/mocks/produtos'
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
  tipo: 'todos' as 'todos' | 'entradas' | 'saidas',
  origem: 'todos',
  produto: '',
}

function calcular(f: typeof DEFAULT) {
  const { inicio, fim } = getPeriodDates(f.periodo, f.dataInicio, f.dataFim)
  return calcularMovimentacoesPeriodo(
    movimentacoesMock, produtosMock, inicio, fim,
    f.tipo, f.origem, f.produto
  )
}

const TIPO_LABEL: Record<MovimentacaoEstoque['tipo'], string> = {
  compra: 'Compra',
  venda: 'Venda',
  ajuste_positivo: 'Ajuste +',
  ajuste_negativo: 'Ajuste -',
  devolucao_cliente: 'Devolução',
  perda: 'Perda',
}

export function MovimentacoesPeriodo() {
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
      label: 'Total Movimentações',
      value: String(dados.totais.totalMovimentacoes),
      color: 'indigo' as const,
      icon: RefreshCw,
    },
    {
      label: 'Total Entradas',
      value: String(dados.totais.totalEntradas),
      sublabel: 'unidades',
      color: 'emerald' as const,
      icon: ArrowDown,
    },
    {
      label: 'Total Saídas',
      value: String(dados.totais.totalSaidas),
      sublabel: 'unidades',
      color: 'red' as const,
      icon: ArrowUp,
    },
    {
      label: 'Produto + Ativo',
      value: dados.totais.produtoMaisMovimentos.length > 18
        ? dados.totais.produtoMaisMovimentos.slice(0, 18) + '…'
        : dados.totais.produtoMaisMovimentos,
      color: 'violet' as const,
      icon: Package,
    },
  ]

  const colunas = [
    {
      key: 'criado_em',
      label: 'Data',
      render: (row: Record<string, unknown>) => {
        const v = row.criado_em as string
        return v ? v.split(' ')[0] : '-'
      },
    },
    { key: 'produtoNome', label: 'Produto' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (row: Record<string, unknown>) => (
        <span className="text-xs text-white/50">
          {TIPO_LABEL[row.tipo as MovimentacaoEstoque['tipo']] || String(row.tipo)}
        </span>
      ),
    },
    {
      key: 'operacao',
      label: 'Operação',
      render: (row: Record<string, unknown>) => {
        const isEntrada = row.operacao === 'entrada'
        return (
          <span className={`flex items-center gap-1 text-xs ${isEntrada ? 'text-emerald-400' : 'text-red-400'}`}>
            {isEntrada ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
            {isEntrada ? 'Entrada' : 'Saída'}
          </span>
        )
      },
    },
    { key: 'quantidade', label: 'Quantidade', align: 'right' as const },
    {
      key: 'origem',
      label: 'Origem',
      render: (row: Record<string, unknown>) => (
        <span className="text-xs text-white/40 capitalize">{String(row.origem)}</span>
      ),
    },
    { key: 'usuario', label: 'Usuário' },
  ]

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <div className="flex items-center gap-2 mb-1">
          <RefreshCw size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Movimentações por Período</h2>
        </div>
        <p className="text-sm text-white/40">
          Histórico de todas as movimentações de estoque no período selecionado.
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
          label="Tipo"
          value={filtros.tipo}
          onChange={(v) => setFiltros((f) => ({ ...f, tipo: v as typeof DEFAULT.tipo }))}
        >
          <option value="todos">Todos</option>
          <option value="entradas">Entradas</option>
          <option value="saidas">Saídas</option>
        </FilterSelect>
        <FilterSelect
          label="Origem"
          value={filtros.origem}
          onChange={(v) => setFiltros((f) => ({ ...f, origem: v }))}
        >
          <option value="todos">Todas</option>
          <option value="vendas">Vendas</option>
          <option value="compras">Compras</option>
          <option value="ajustes">Ajustes</option>
          <option value="devolucoes">Devoluções</option>
          <option value="perdas">Perdas</option>
        </FilterSelect>
        <FilterSelect
          label="Produto"
          value={filtros.produto}
          onChange={(v) => setFiltros((f) => ({ ...f, produto: v }))}
        >
          <option value="">Todos</option>
          {produtosMock.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </FilterSelect>
      </FiltrosRelatorio>

      {loading ? (
        <SkeletonRelatorio />
      ) : (
        <>
          <TotalizadoresRelatorio items={totais} />

          <GraficoRelatorio title="Entradas e Saídas por Dia">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dados.grafico} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                <defs>
                  <linearGradient id="fillEntradas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillSaidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID_PROPS} />
                <XAxis dataKey="data" {...AXIS_PROPS} interval="preserveStartEnd" />
                <YAxis {...AXIS_PROPS} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF', paddingTop: 8 }} />
                <Area
                  type="monotone"
                  dataKey="entradas"
                  name="Entradas"
                  stroke="#10B981"
                  fill="url(#fillEntradas)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="saidas"
                  name="Saídas"
                  stroke="#EF4444"
                  fill="url(#fillSaidas)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </GraficoRelatorio>

          <TabelaRelatorio
            title="Histórico de Movimentações"
            columns={colunas}
            data={dados.tabela as unknown as Record<string, unknown>[]}
            emptyMessage="Nenhuma movimentação no período"
          />

          <ExportacaoRelatorio />
        </>
      )}
    </div>
  )
}
