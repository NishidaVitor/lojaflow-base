import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto flex items-center gap-3 bg-[#1C1C26] border border-[#2A2A3A] rounded-xl px-4 py-3 shadow-2xl min-w-64 max-w-sm"
            >
              {toast.type === 'success' && (
                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              )}
              {toast.type === 'error' && (
                <XCircle size={16} className="text-red-400 shrink-0" />
              )}
              {toast.type === 'info' && (
                <Info size={16} className="text-blue-400 shrink-0" />
              )}
              <span className="text-sm text-white/90 flex-1">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-white/30 hover:text-white/60 transition-colors shrink-0"
                aria-label="Fechar notificação"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
