import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Eye, Package } from 'lucide-react'
import type { ProdutoComEstoque } from '@/types/produto'
import { ClienteBadge } from '@/components/clientes/ClienteBadge'
import { EstoqueBadge } from './EstoqueBadge'
import { getStatusEstoque, formatCurrency } from '@/utils/estoque'

interface ProdutoTabelaProps {
  produtos: ProdutoComEstoque[]
  onLimparFiltros?: () => void
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.04 } },
}

const rowVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

export function ProdutoTabela({ produtos, onLimparFiltros }: ProdutoTabelaProps) {
  const navigate = useNavigate()

  if (produtos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-white/10 bg-white/5"
      >
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Package size={24} className="text-white/25" />
        </div>
        <p className="text-white/50 font-medium">Nenhum produto encontrado</p>
        <p className="text-white/25 text-sm mt-1">Tente ajustar os filtros ou adicione um novo produto.</p>
        {onLimparFiltros && (
          <button
            onClick={onLimparFiltros}
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </motion.div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Table header */}
      <div className="hidden lg:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_1fr_40px] gap-3 px-4 py-3 border-b border-white/8 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
        <span>Produto</span>
        <span>Categoria</span>
        <span className="text-right">Preço</span>
        <span className="text-center">Estoque</span>
        <span className="text-center">Status</span>
        <span className="text-right">Ações</span>
      </div>

      <motion.div variants={containerVariants} initial="initial" animate="animate">
        {produtos.map((item) => {
          const status = getStatusEstoque(item.estoque)
          return (
            <motion.div
              key={item.produto.id}
              variants={rowVariants}
              onClick={() => navigate(`/produtos/${item.produto.id}`)}
              className="group relative grid grid-cols-1 lg:grid-cols-[2.5fr_1fr_1fr_1fr_1fr_1fr_40px] gap-2 lg:gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/4 transition-colors cursor-pointer"
            >
              {/* Left indicator on hover */}
              <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Produto: image + name + sku */}
              <div className="flex items-center gap-3">
                <img
                  src={item.produto.imagem_url}
                  alt={item.produto.nome}
                  className="w-10 h-10 rounded-lg object-cover bg-white/5 shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">{item.produto.nome}</p>
                  <p className="text-xs text-white/35 font-mono">{item.produto.sku}</p>
                </div>
              </div>

              {/* Categoria */}
              <div className="hidden lg:flex items-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-white/8 text-white/60 border border-white/10">
                  {item.categoria.nome}
                </span>
              </div>

              {/* Preço */}
              <div className="hidden lg:flex flex-col items-end justify-center">
                {item.produto.preco_promocional ? (
                  <>
                    <span className="text-xs text-white/35 line-through">
                      {formatCurrency(item.produto.preco_venda)}
                    </span>
                    <span className="text-sm font-semibold text-cyan-400">
                      {formatCurrency(item.produto.preco_promocional)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-white/80">
                    {formatCurrency(item.produto.preco_venda)}
                  </span>
                )}
              </div>

              {/* Estoque */}
              <div className="hidden lg:flex items-center justify-center">
                <EstoqueBadge status={status} value={item.estoque.estoque_atual} />
              </div>

              {/* Status produto */}
              <div className="hidden lg:flex items-center justify-center">
                <ClienteBadge status={item.produto.ativo ? 'ativo' : 'inativo'} />
              </div>

              {/* Ação */}
              <div className="hidden lg:flex items-center justify-end">
                <button
                  onClick={() => navigate(`/produtos/${item.produto.id}`)}
                  className="p-1.5 rounded-lg text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                  aria-label={`Ver detalhes de ${item.produto.nome}`}
                >
                  <Eye size={16} />
                </button>
              </div>

              {/* Mobile row */}
              <div
                className="flex lg:hidden items-center justify-between gap-2 cursor-pointer"
                onClick={() => navigate(`/produtos/${item.produto.id}`)}
              >
                <EstoqueBadge status={status} value={item.estoque.estoque_atual} />
                <ClienteBadge status={item.produto.ativo ? 'ativo' : 'inativo'} />
                {item.produto.preco_promocional ? (
                  <span className="text-sm font-semibold text-cyan-400">
                    {formatCurrency(item.produto.preco_promocional)}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-white/70">
                    {formatCurrency(item.produto.preco_venda)}
                  </span>
                )}
                <Eye size={15} className="text-white/30 ml-1 shrink-0" />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
