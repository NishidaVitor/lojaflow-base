import { useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, X } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useBuscaGlobal } from '@/hooks/useBuscaGlobal'
import { PainelBusca } from './PainelBusca'

export function BuscaGlobal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    termo,
    setTermo,
    resultados,
    recentes,
    carregando,
    aberto,
    abrir,
    fechar: fecharHook,
    indiceSelecionado,
    selecionar,
    navegarTeclado,
    confirmarSelecao,
    limparRecentes,
  } = useBuscaGlobal()

  const fechar = useCallback(() => {
    fecharHook()
    setTermo('')
  }, [fecharHook, setTermo])

  useClickOutside(containerRef, fechar)

  // Ctrl+K / Cmd+K global shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        abrir()
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [abrir])

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); navegarTeclado('down') }
    if (e.key === 'ArrowUp') { e.preventDefault(); navegarTeclado('up') }
    if (e.key === 'Enter') { e.preventDefault(); confirmarSelecao() }
    if (e.key === 'Escape') { fechar() }
  }

  function handleFocus() {
    abrir()
  }

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <motion.div
        animate={{ width: aberto ? 400 : 280 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative"
      >
        {carregando ? (
          <Loader2
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 animate-spin pointer-events-none z-10"
          />
        ) : (
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none z-10"
          />
        )}

        <input
          ref={inputRef}
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleInputKeyDown}
          placeholder="Buscar..."
          autoComplete="off"
          className="w-full bg-white/5 border border-[#2A2A3A] focus:border-indigo-500/50 text-white/70 placeholder:text-white/25 text-sm rounded-xl pl-9 pr-16 py-2 focus:outline-none focus:bg-white/8 transition-all"
          aria-label="Buscar"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {termo ? (
            <button
              onClick={() => setTermo('')}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={13} />
            </button>
          ) : (
            !aberto && (
              <span className="text-[10px] text-white/25 bg-white/8 border border-white/10 rounded px-1.5 py-0.5 font-mono leading-none">
                ⌘K
              </span>
            )
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {aberto && (
          <PainelBusca
            termo={termo}
            resultados={resultados}
            recentes={recentes}
            carregando={carregando}
            indiceSelecionado={indiceSelecionado}
            onSelecionar={(r) => { selecionar(r); fechar() }}
            onLimparRecentes={limparRecentes}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
