import { motion } from 'framer-motion'
import { Clock, SearchX, Loader2, User, Package, ShoppingBag, ArrowLeftRight } from 'lucide-react'
import { ResultadoBuscaItem } from './ResultadoBuscaItem'
import type { ResultadoBusca, TipoBusca } from '@/types/busca'

const GRUPO_CONFIG: Record<TipoBusca, { label: string; icone_cor: string }> = {
  cliente: { label: 'Clientes', icone_cor: '#06B6D4' },
  produto: { label: 'Produtos', icone_cor: '#7C3AED' },
  venda: { label: 'Vendas', icone_cor: '#4F46E5' },
  movimentacao: { label: 'Movimentações', icone_cor: '#10B981' },
}

const GRUPO_ICONE = {
  cliente: User,
  produto: Package,
  venda: ShoppingBag,
  movimentacao: ArrowLeftRight,
}

const TIPO_ORDER: TipoBusca[] = ['cliente', 'produto', 'venda', 'movimentacao']

function groupResults(resultados: ResultadoBusca[]) {
  const map: Partial<Record<TipoBusca, ResultadoBusca[]>> = {}
  resultados.forEach((r) => {
    if (!map[r.tipo]) map[r.tipo] = []
    map[r.tipo]!.push(r)
  })
  return TIPO_ORDER.filter((t) => map[t]?.length).map((t) => ({
    tipo: t,
    ...GRUPO_CONFIG[t],
    Icone: GRUPO_ICONE[t],
    resultados: map[t]!,
  }))
}

interface Props {
  termo: string
  resultados: ResultadoBusca[]
  recentes: ResultadoBusca[]
  carregando: boolean
  indiceSelecionado: number
  onSelecionar: (r: ResultadoBusca) => void
  onLimparRecentes: () => void
}

export function PainelBusca({
  termo,
  resultados,
  recentes,
  carregando,
  indiceSelecionado,
  onSelecionar,
  onLimparRecentes,
}: Props) {
  const mostrandoRecentes = termo.length < 2
  const grupos = mostrandoRecentes ? [] : groupResults(resultados)
  const semResultados = !mostrandoRecentes && !carregando && resultados.length === 0

  // Flat index mapping for keyboard nav
  let flatIdx = 0
  const idxMap: ResultadoBusca[] = mostrandoRecentes ? recentes : resultados

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute top-12 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 min-w-[360px]"
    >
      {/* Loading */}
      {carregando && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <Loader2 size={14} className="text-white/30 animate-spin" />
          <span className="text-xs text-white/30">Buscando...</span>
        </div>
      )}

      {/* Recentes */}
      {mostrandoRecentes && !carregando && (
        <div>
          {recentes.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                  Acessados recentemente
                </span>
                <button
                  onClick={onLimparRecentes}
                  className="text-[10px] text-white/25 hover:text-white/50 transition-colors"
                >
                  Limpar
                </button>
              </div>
              <div className="p-2">
                {recentes.map((r, i) => (
                  <div key={r.id} className="flex items-center gap-2">
                    <Clock size={12} className="text-white/20 shrink-0 ml-1" />
                    <div className="flex-1">
                      <ResultadoBuscaItem
                        resultado={r}
                        termo=""
                        isSelected={indiceSelecionado === i}
                        onClick={() => onSelecionar(r)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-4 py-5 text-center">
              <p className="text-xs text-white/25">Digite para buscar clientes, produtos ou vendas</p>
            </div>
          )}
        </div>
      )}

      {/* Resultados agrupados */}
      {!mostrandoRecentes && !carregando && grupos.length > 0 && (
        <div
          className="overflow-y-auto max-h-80"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
        >
          {grupos.map((grupo, gi) => {
            const startIdx = flatIdx
            flatIdx += grupo.resultados.length
            void startIdx
            return (
              <div key={grupo.tipo}>
                {gi > 0 && <div className="h-px bg-white/5 mx-3" />}
                <div className="flex items-center gap-2 px-4 py-2">
                  <grupo.Icone size={12} style={{ color: grupo.icone_cor }} />
                  <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest flex-1">
                    {grupo.label}
                  </span>
                  <span className="text-[10px] text-white/20">
                    {grupo.resultados.length} resultado{grupo.resultados.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="px-2 pb-1">
                  {grupo.resultados.map((r, j) => {
                    const globalIdx = idxMap.indexOf(r)
                    return (
                      <ResultadoBuscaItem
                        key={r.id}
                        resultado={r}
                        termo={termo}
                        isSelected={indiceSelecionado === globalIdx}
                        onClick={() => onSelecionar(r)}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Sem resultados */}
      {semResultados && (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <SearchX size={28} className="text-white/15 mb-3" />
          <p className="text-sm text-white/50 mb-3">
            Nenhum resultado para{' '}
            <span className="text-white/70 font-medium">"{termo}"</span>
          </p>
          <div className="text-left space-y-1">
            <p className="text-xs text-white/25">Tente buscar por:</p>
            <p className="text-xs text-white/30">• Nome do cliente</p>
            <p className="text-xs text-white/30">• Número da venda (VND-001)</p>
            <p className="text-xs text-white/30">• Nome ou SKU do produto</p>
          </div>
        </div>
      )}

      {/* Footer — keyboard hints */}
      <div className="flex items-center justify-center gap-3 px-4 py-2 border-t border-white/5">
        <span className="text-[10px] text-white/20">↑↓ navegar</span>
        <span className="text-white/10">·</span>
        <span className="text-[10px] text-white/20">Enter selecionar</span>
        <span className="text-white/10">·</span>
        <span className="text-[10px] text-white/20">Esc fechar</span>
      </div>
    </motion.div>
  )
}
