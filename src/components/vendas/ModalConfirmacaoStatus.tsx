import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { StatusVenda } from '@/types/venda'

const config: Record<string, { title: string; description: string; confirmLabel: string; variant: 'default' | 'danger' | 'warning' }> = {
  confirmada:   { title: 'Confirmar Venda',    description: 'A venda será movida para Confirmada e entrará na fila de separação.',                     confirmLabel: 'Confirmar',      variant: 'default' },
  em_separacao: { title: 'Iniciar Separação',  description: 'O estoque dos itens será baixado agora. Esta ação não pode ser desfeita facilmente.',     confirmLabel: 'Iniciar',        variant: 'warning' },
  entregue:     { title: 'Marcar como Entregue', description: 'A venda será finalizada como entregue ao cliente.',                                    confirmLabel: 'Marcar Entregue', variant: 'default' },
  cancelada:    { title: 'Cancelar Venda',     description: 'A venda será cancelada. Se estava em separação, o estoque será restaurado automaticamente.', confirmLabel: 'Cancelar Venda', variant: 'danger' },
  devolvida:    { title: 'Registrar Devolução', description: 'O estoque dos itens será restaurado automaticamente.',                                   confirmLabel: 'Confirmar Devolução', variant: 'warning' },
}

interface Props {
  open: boolean
  novoStatus: StatusVenda | null
  onClose: () => void
  onConfirm: () => void
}

export function ModalConfirmacaoStatus({ open, novoStatus, onClose, onConfirm }: Props) {
  if (!novoStatus || !config[novoStatus]) return null
  const { title, description, confirmLabel, variant } = config[novoStatus]

  const confirmClass =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-500 text-white'
      : variant === 'warning'
      ? 'bg-amber-500 hover:bg-amber-400 text-white'
      : 'bg-indigo-600 hover:bg-indigo-500 text-white'

  const Icon = variant === 'danger' || variant === 'warning' ? AlertTriangle : CheckCircle2
  const iconClass = variant === 'danger' ? 'text-red-400' : variant === 'warning' ? 'text-amber-400' : 'text-indigo-400'

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-[#1C1C26] border border-[#2A2A3A] rounded-2xl p-6 shadow-2xl focus:outline-none"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className={`p-2 rounded-lg bg-white/5 shrink-0 ${iconClass}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <Dialog.Title className="text-sm font-semibold text-white mb-1">{title}</Dialog.Title>
                    <Dialog.Description className="text-xs text-white/50 leading-relaxed">{description}</Dialog.Description>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white/80 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => { onConfirm(); onClose() }}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors active:scale-95 ${confirmClass}`}
                  >
                    {confirmLabel}
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
