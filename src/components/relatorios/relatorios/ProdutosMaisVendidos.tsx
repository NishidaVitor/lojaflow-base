import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Package, Hash, DollarSign, Tag } from 'lucide-react'
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
  calcularProdutosMaisVendidos,
  formatCurrency,
  getPeriodDates,
  type PeriodoOpcao,
} from '@/utils/relatorios'
import { vendasMock } from '@/mocks/vendas'
import { produtosMock } from '@/mocks/produtos'
import { categoriasMock } from '@/mocks/categorias'
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
  categoria: '',
  ordenarPor: 'quantidade' as 'quantidade' | 'receita',
  top: 10 as 5 | 10 | 20,
}

function calcular(f: typeof DEFAULT) {
  const { inicio, fim } = getPeriodDates(f.periodo, f.dataInicio, f.dataFim)
  return calcularProdutosMaisVendidos(
    vendasMock, produtosMock, categoriasMock, inicio, fim,
    f.categoria, f.ordenarPor, f.top
  )
}

export function ProdutosMaisVendidos() {
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
      label: 'Produto Mais Vendido',
      value: dados.totais.produtoMaisVendido.length > 20
        ? dados.totais.produtoMaisVendido.slice(0, 20) + '…'
        : dados.totais.produtoMaisVendido,
      color: 'indigo' as const,
      icon: Package,
    },
    {
      label: 'Total de Itens',
      value: String(dados.totais.totalItens),
      color: 'violet' as const,
      icon: Hash,
    },
    {
      label: 'Receita Total',
      value: formatCurrency(dados.totais.receitaTotal),
      color: 'cyan' as const,
      icon: DollarSign,
    },
    {
      label: 'Categoria Destaque',
      value: dados.totais.categoriaMaisVendida,
      color: 'emerald' as const,
      icon: Tag,
    },
  ]

  const colunas = [
    {
      key: 'rank',
      label: '#',
      render: (_: Record<string, unknown>, i: number) => (
        <span className="text-white/40 text-xs font-mono">{i + 1}</span>
      ),
    },
    {
      key: 'produtoNome',
      label: 'Produto',
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center gap-2">
          <img
            src={row.imagem as string}
            alt=""
            className="w-7 h-7 rounded-md object-cover opacity-80"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div>
            <p className="text-white/80 text-xs leading-tight">{row.produtoNome as string}</p>
          </div>
        </div>
      ),
    },
    { key: 'sku', label: 'SKU', render: (row: Record<string, unknown>) => (
      <span className="text-xs text-white/40 font-mono">{row.sku as string}</span>
    )},
    { key: 'categoriaNome', label: 'Categoria' },
    { key: 'qtdVendida', label: 'Qtd Vendida', align: 'right' as const },
    {
      key: 'receita',
      label: 'Receita',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => formatCurrency(row.receita as number),
    },
    {
      key: 'pctTotal',
      label: '% do Total',
      align: 'right' as const,
      render: (row: Record<string, unknown>) => `${(row.pctTotal as number).toFixed(1)}%`,
    },
  ]

  // Assign color by category
  const catColors: Record<string, string> = {}
  dados.dados.forEach((d) => {
    if (!catColors[d.categoriaId]) {
      catColors[d.categoriaId] = CHART_COLORS[Object.keys(catColors).length % CHART_COLORS.length]
    }
  })

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <div className="flex items-center gap-2 mb-1">
          <Package size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Produtos Mais Vendidos</h2>
        </div>
        <p className="text-sm text-white/40">
          Ranking dos produtos com maior saída no período selecionado.
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
          label="Ordenar por"
          value={filtros.ordenarPor}
          onChange={(v) => setFiltros((f) => ({ ...f, ordenarPor: v as typeof DEFAULT.ordenarPor }))}
        >
          <option value="quantidade">Quantidade Vendida</option>
          <option value="receita">Receita Gerada</option>
        </FilterSelect>
        <FilterSelect
          label="Exibir top"
          value={String(filtros.top)}
          onChange={(v) => setFiltros((f) => ({ ...f, top: Number(v) as typeof DEFAULT.top }))}
        >
          <option value="5">Top 5</option>
          <option value="10">Top 10</option>
          <option value="20">Top 20</option>
        </FilterSelect>
      </FiltrosRelatorio>

      {loading ? (
        <SkeletonRelatorio />
      ) : (
        <>
          <TotalizadoresRelatorio items={totais} />

          <GraficoRelatorio title="Ranking por Produto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dados.dados}
                margin={{ top: 5, right: 20, bottom: 40, left: 20 }}
              >
                <CartesianGrid {...GRID_PROPS} />
                <XAxis
                  dataKey="produtoNome"
                  {...AXIS_PROPS}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + '…' : v}
                />
                <YAxis {...AXIS_PROPS} />
                <Tooltip
                  content={
                    <CustomTooltip
                      formatValue={(name, v) =>
                        name === 'Receita' ? formatCurrency(v) : String(v)
                      }
                    />
                  }
                />
                <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF', paddingTop: 8 }} />
                <Bar
                  dataKey={filtros.ordenarPor === 'quantidade' ? 'qtdVendida' : 'receita'}
                  name={filtros.ordenarPor === 'quantidade' ? 'Qtd Vendida' : 'Receita'}
                  radius={[4, 4, 0, 0]}
                >
                  {dados.dados.map((d, i) => (
                    <Cell key={i} fill={catColors[d.categoriaId] || CHART_COLORS[0]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GraficoRelatorio>

          <TabelaRelatorio
            title="Detalhamento de Produtos"
            columns={colunas}
            data={dados.dados as unknown as Record<string, unknown>[]}
            emptyMessage="Nenhum produto vendido no período"
          />

          <ExportacaoRelatorio />
        </>
      )}
    </div>
  )
}
