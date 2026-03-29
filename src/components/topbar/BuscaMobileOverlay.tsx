import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'
import { PainelBusca } from './PainelBusca'
import type { ResultadoBusca } from '@/types/busca'

interface Props {
  aberto: boolean
  onFechar: () => void
  termo: string
  setTermo: (v: string) => void
  resultados: ResultadoBusca[]
  recentes: ResultadoBusca[]
  carregando: boolean
  indiceSelecionado: number
  onSelecionar: (r: ResultadoBusca) => void
  onLimparRecentes: () => void
  navegarTeclado: (dir: 'up' | 'down') => void
  confirmarSelecao: () => void
}

export function BuscaMobileOverlay({
  aberto,
  onFechar,
  termo,
  setTermo,
  resultados,
  recentes,
  carregando,
  indiceSelecionado,
  onSelecionar,
  onLimparRecentes,
  navegarTeclado,
  confirmarSelecao,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (aberto) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setTermo('')
    }
  }, [aberto, setTermo])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); navegarTeclado('down') }
    if (e.key === 'ArrowUp') { e.preventDefault(); navegarTeclado('up') }
    if (e.key === 'Enter') { e.preventDefault(); confirmarSelecao() }
    if (e.key === 'Escape') { onFechar() }
  }

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-0 z-50 bg-[#0F0F13]/98 backdrop-blur-md flex flex-col"
        >
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <div className="flex-1 relative">
              {carregando ? (
                <Loader2
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 animate-spin"
                />
              ) : (
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar clientes, produtos, vendas..."
                className="w-full bg-white/8 border border-white/10 focus:border-indigo-500/50 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all placeholder:text-white/25"
                autoComplete="off"
              />
              {termo && (
                <button
                  onClick={() => setTermo('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={onFechar}
              className="text-sm text-white/50 hover:text-white transition-colors shrink-0"
            >
              Cancelar
            </button>
          </div>

          {/* Results panel (static, not dropdown) */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-2 pt-2 relative">
              <PainelBusca
                termo={termo}
                resultados={resultados}
                recentes={recentes}
                carregando={carregando}
                indiceSelecionado={indiceSelecionado}
                onSelecionar={(r) => { onSelecionar(r); onFechar() }}
                onLimparRecentes={onLimparRecentes}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
