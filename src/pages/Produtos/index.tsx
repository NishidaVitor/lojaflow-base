import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Package, Plus, Search, AlertTriangle, X } from 'lucide-react'
import { produtosStore, estoqueStore } from '@/store/produtosStore'
import { categoriasMock } from '@/mocks/categorias'
import type { ProdutoComEstoque, StatusEstoque } from '@/types/produto'
import { getStatusEstoque } from '@/utils/estoque'
import { ProdutoTabela } from '@/components/produtos/ProdutoTabela'
import { cn } from '@/lib/utils'

type FiltroAtivo = 'todos' | 'ativo' | 'inativo'
type FiltroEstoque = 'todos' | StatusEstoque

function buildProdutosComEstoque(): ProdutoComEstoque[] {
  return Array.from(produtosStore.values()).map((produto) => ({
    produto,
    estoque: estoqueStore.get(produto.id)!,
    categoria: categoriasMock.find((c) => c.id === produto.categoria_id)!,
  }))
}

export function ProdutosListView() {
  const [busca, setBusca] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [filtroEstoque, setFiltroEstoque] = useState<FiltroEstoque>('todos')
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroAtivo>('todos')

  const todos = useMemo(() => buildProdutosComEstoque(), [])

  const filtrados = useMemo(() => {
    const termo = busca.toLowerCase().trim()
    return todos.filter((item) => {
      const matchBusca =
        !termo ||
        item.produto.nome.toLowerCase().includes(termo) ||
        item.produto.sku.toLowerCase().includes(termo) ||
        item.produto.marca.toLowerCase().includes(termo)
      const matchCategoria =
        filtroCategoria === 'todas' || item.produto.categoria_id === filtroCategoria
      const status = getStatusEstoque(item.estoque)
      const matchEstoque = filtroEstoque === 'todos' || status === filtroEstoque
      const matchAtivo =
        filtroAtivo === 'todos' ||
        (filtroAtivo === 'ativo' ? item.produto.ativo : !item.produto.ativo)
      return matchBusca && matchCategoria && matchEstoque && matchAtivo
    })
  }, [todos, busca, filtroCategoria, filtroEstoque, filtroAtivo])

  const alertas = useMemo(
    () => todos.filter((i) => ['critico', 'zerado'].includes(getStatusEstoque(i.estoque))),
    [todos]
  )

  function limparFiltros() {
    setBusca('')
    setFiltroCategoria('todas')
    setFiltroEstoque('todos')
    setFiltroAtivo('todos')
  }

  const filtrosEstoque: { label: string; value: FiltroEstoque }[] = [
    { label: 'Todos', value: 'todos' },
    { label: 'Normal', value: 'normal' },
    { label: 'Baixo', value: 'baixo' },
    { label: 'Crítico', value: 'critico' },
    { label: 'Zerado', value: 'zerado' },
  ]

  const filtrosAtivo: { label: string; value: FiltroAtivo }[] = [
    { label: 'Todos', value: 'todos' },
    { label: 'Ativos', value: 'ativo' },
    { label: 'Inativos', value: 'inativo' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <Package size={20} className="text-indigo-400" />
            Produtos
          </h1>
          <p className="text-sm text-white/40 mt-0.5">{todos.length} produtos cadastrados</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shrink-0"
        >
          <Plus size={15} />
          Novo Produto
        </motion.button>
      </motion.div>

      {/* Alert banner */}
      {alertas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/25 rounded-xl px-4 py-3"
        >
          <AlertTriangle size={16} className="text-orange-400 shrink-0" />
          <p className="text-sm text-orange-300 flex-1">
            <span className="font-semibold">{alertas.length} produto{alertas.length > 1 ? 's' : ''}</span>{' '}
            com estoque crítico ou zerado
          </p>
          <button
            onClick={() => setFiltroEstoque(filtroEstoque === 'critico' ? 'todos' : 'critico')}
            className="text-xs text-orange-400 hover:text-orange-300 font-medium border border-orange-500/30 rounded-lg px-2.5 py-1 hover:bg-orange-500/10 transition-colors"
          >
            {filtroEstoque === 'critico' ? 'Limpar filtro' : 'Ver apenas críticos'}
          </button>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.07, ease: 'easeOut' }}
        className="flex flex-col gap-3"
      >
        {/* Row 1: Search + Categoria */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, SKU ou marca…"
              className="w-full bg-white/5 border border-white/10 text-white/80 placeholder:text-white/25 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-indigo-500/50 transition-all"
              aria-label="Buscar produtos"
            />
          </div>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="bg-white/5 border border-white/10 text-white/70 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500/50 transition-all"
            aria-label="Filtrar por categoria"
          >
            <option value="todas" className="bg-[#1C1C26]">Todas as categorias</option>
            {categoriasMock.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#1C1C26]">{c.nome}</option>
            ))}
          </select>
        </div>

        {/* Row 2: Status tabs */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Estoque status */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 self-start">
            {filtrosEstoque.map((f) => (
              <button
                key={f.value}
                onClick={() => setFiltroEstoque(f.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                  filtroEstoque === f.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-white/40 hover:text-white/70'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Produto ativo/inativo */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 self-start">
            {filtrosAtivo.map((f) => (
              <button
                key={f.value}
                onClick={() => setFiltroAtivo(f.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                  filtroAtivo === f.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-white/40 hover:text-white/70'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Clear filters */}
          {(busca || filtroCategoria !== 'todas' || filtroEstoque !== 'todos' || filtroAtivo !== 'todos') && (
            <button
              onClick={limparFiltros}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 transition-all self-start"
            >
              <X size={12} />
              Limpar
            </button>
          )}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
      >
        <ProdutoTabela produtos={filtrados} onLimparFiltros={limparFiltros} />
      </motion.div>

      {/* Count footer */}
      {filtrados.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-white/30 text-center pb-2"
        >
          Exibindo {filtrados.length} de {todos.length} produtos
        </motion.p>
      )}
    </div>
  )
}
