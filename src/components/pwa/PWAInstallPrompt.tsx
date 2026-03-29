import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'pwa_install_dismissed'
const DISMISS_DAYS = 7

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const dismissed = localStorage.getItem(DISMISS_KEY)
    if (dismissed) {
      const daysSince = (Date.now() - new Date(dismissed).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSince < DISMISS_DAYS) return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setVisible(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setVisible(false)
    localStorage.setItem(DISMISS_KEY, new Date().toISOString())
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <div className="bg-[#1C1C2E]/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl p-4 shadow-2xl shadow-indigo-500/10">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                <span className="text-white font-black text-xl">L</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Instalar LojaFlow</p>
                <p className="text-xs text-white/50 mt-0.5">
                  Acesse mais rápido direto da sua tela inicial, sem abrir o navegador.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleInstall}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    <Download size={12} />
                    Instalar
                  </motion.button>
                  <button
                    onClick={handleDismiss}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    Agora não
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/20 hover:text-white/50 transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
