import { useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useNotificacoes } from '@/hooks/useNotificacoes'
import { PainelNotificacoes } from './PainelNotificacoes'
import { useState, useEffect } from 'react'

export function SinoNotificacoes() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [aberto, setAberto] = useState(false)
  const {
    filtradas,
    naoLidas,
    filtroAtivo,
    setFiltroAtivo,
    marcarComoLida,
    marcarTodasComoLidas,
    removerNotificacao,
  } = useNotificacoes()

  const fechar = useCallback(() => setAberto(false), [])

  useClickOutside(containerRef, fechar)

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && aberto) fechar()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [aberto, fechar])

  const contador = Math.min(naoLidas, 9)
  const labelContador = naoLidas > 9 ? '9+' : String(naoLidas)

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setAberto((v) => !v)}
        className="relative p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Notificações"
      >
        <Bell size={20} />

        {/* Badge */}
        <AnimatePresence>
          {naoLidas > 0 && (
            <motion.span
              key={contador}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none"
            >
              {labelContador}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {aberto && (
          <PainelNotificacoes
            filtradas={filtradas}
            naoLidas={naoLidas}
            filtroAtivo={filtroAtivo}
            setFiltroAtivo={setFiltroAtivo}
            marcarComoLida={marcarComoLida}
            marcarTodasComoLidas={marcarTodasComoLidas}
            removerNotificacao={removerNotificacao}
            onClose={fechar}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
