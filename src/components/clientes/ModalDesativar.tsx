import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface ModalDesativarProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  nomeCliente: string
  statusAtual: 'ativo' | 'inativo'
}

export function ModalDesativar({
  open,
  onClose,
  onConfirm,
  nomeCliente,
  statusAtual,
}: ModalDesativarProps) {
  const isDesativando = statusAtual === 'ativo'

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>

            {/* Modal */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#1C1C26] border border-[#2A2A3A] rounded-2xl p-6 shadow-2xl focus:outline-none"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 mx-auto mb-4">
                  <AlertTriangle size={22} className="text-red-400" />
                </div>

                {/* Title */}
                <Dialog.Title className="text-base font-semibold text-white text-center mb-2">
                  {isDesativando ? 'Desativar cliente?' : 'Reativar cliente?'}
                </Dialog.Title>

                {/* Description */}
                <Dialog.Description className="text-sm text-white/50 text-center leading-relaxed">
                  {isDesativando ? (
                    <>
                      O cliente <span className="text-white/80 font-medium">{nomeCliente}</span> será
                      marcado como inativo. Esta ação pode ser revertida a qualquer momento.
                    </>
                  ) : (
                    <>
                      O cliente <span className="text-white/80 font-medium">{nomeCliente}</span> será
                      reativado e poderá realizar novas compras normalmente.
                    </>
                  )}
                </Dialog.Description>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white/80 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      onConfirm()
                      onClose()
                    }}
                    className={
                      isDesativando
                        ? 'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-500 transition-colors active:scale-95'
                        : 'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors active:scale-95'
                    }
                  >
                    Confirmar
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
