import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

export function PWAUpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.ready
      .then((reg) => {
        setRegistration(reg)
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setNeedRefresh(true)
            }
          })
        })
      })
      .catch(() => {/* SW not available */})
  }, [])

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
    setNeedRefresh(false)
    window.location.reload()
  }

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-50 bg-violet-600/90 backdrop-blur-sm border-b border-violet-500/50 px-4 py-2.5 flex items-center justify-between gap-3"
        >
          <p className="text-sm text-white font-medium">Nova versão disponível</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleUpdate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            <RefreshCw size={13} />
            Atualizar agora
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
