import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Download, RefreshCw, CheckCircle, XCircle, AlertCircle, Monitor, Apple } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type SwState = 'checking' | 'active' | 'inactive'

export function SobreApp() {
  const { showToast } = useToast()
  const [isStandalone] = useState(() => window.matchMedia('(display-mode: standalone)').matches)
  const [swStatus, setSwStatus] = useState<SwState>('checking')
  const [cacheStatus, setCacheStatus] = useState<SwState>('checking')
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(() => setSwStatus('active'))
        .catch(() => setSwStatus('inactive'))
    } else {
      setSwStatus('inactive')
    }

    if ('caches' in window) {
      caches.keys().then((keys) => setCacheStatus(keys.length > 0 ? 'active' : 'inactive'))
    } else {
      setCacheStatus('inactive')
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstallDesktop() {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        showToast('LojaFlow instalado com sucesso!', 'success')
        setDeferredPrompt(null)
      }
    } else {
      showToast('Para instalar: clique no ícone de instalação na barra de endereço do Chrome/Edge', 'info')
    }
  }

  async function handleVerificarAtualizacoes() {
    if (!('serviceWorker' in navigator)) {
      showToast('Service Worker não disponível neste navegador', 'info')
      return
    }
    try {
      const reg = await navigator.serviceWorker.ready
      await reg.update()
      showToast('Verificação concluída — você está na versão mais recente', 'success')
    } catch {
      showToast('Erro ao verificar atualizações', 'error')
    }
  }

  function StatusIcon({ status }: { status: SwState }) {
    if (status === 'checking') return <AlertCircle size={16} className="text-yellow-400" />
    if (status === 'active') return <CheckCircle size={16} className="text-emerald-400" />
    return <XCircle size={16} className="text-red-400" />
  }

  function statusText(status: SwState, active: string, inactive: string) {
    if (status === 'checking') return 'Verificando...'
    return status === 'active' ? active : inactive
  }

  function statusColor(status: SwState) {
    if (status === 'checking') return 'text-yellow-400'
    return status === 'active' ? 'text-emerald-400' : 'text-red-400'
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center gap-2 mb-1">
          <Smartphone size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Sobre o App</h2>
        </div>
        <p className="text-sm text-white/40">Informações do sistema e instalação</p>
      </motion.div>

      {/* Informações do sistema */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl font-black text-white">L</span>
        </div>
        <p className="text-2xl font-bold text-white">LojaFlow</p>
        <p className="text-sm text-white/40 mt-1">Versão 1.0.0 MVP</p>
        <p className="text-xs text-white/25 mt-0.5">Build: {new Date().toLocaleDateString('pt-BR')}</p>
      </motion.div>

      {/* Instalação */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="bg-gradient-to-br from-indigo-500/8 to-violet-600/8 border border-indigo-500/20 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Download size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white/70">Instalar LojaFlow</h3>
        </div>
        <p className="text-xs text-white/50 mb-3">
          Instale o LojaFlow na sua tela inicial para acesso rápido, experiência nativa e funcionamento offline.
        </p>

        <ul className="space-y-1.5 mb-5">
          {[
            '⚡ Acesso direto sem abrir o navegador',
            '📱 Experiência nativa em mobile e desktop',
            '🔔 Receba notificações em tempo real',
            '📶 Funciona offline com dados em cache',
            '🚀 Carregamento mais rápido',
          ].map((b) => (
            <li key={b} className="text-xs text-white/60">{b}</li>
          ))}
        </ul>

        <div className="space-y-2.5">
          {/* Desktop */}
          <div className="flex items-center gap-3 p-3 bg-white/3 border border-white/8 rounded-xl">
            <Monitor size={18} className="text-white/40 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/70">Desktop (Chrome / Edge)</p>
              <p className="text-[11px] text-white/35 mt-0.5">Clique no ícone de instalação na barra de endereço</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleInstallDesktop}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
            >
              Instalar
            </motion.button>
          </div>

          {/* Android */}
          <div className="flex items-center gap-3 p-3 bg-white/3 border border-white/8 rounded-xl">
            <Smartphone size={18} className="text-white/40 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/70">Android (Chrome)</p>
              <p className="text-[11px] text-white/35 mt-0.5">Toque em "Adicionar à tela inicial" no menu</p>
            </div>
          </div>

          {/* iOS */}
          <div className="flex items-center gap-3 p-3 bg-white/3 border border-white/8 rounded-xl">
            <Apple size={18} className="text-white/40 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/70">iOS (Safari)</p>
              <p className="text-[11px] text-white/35 mt-0.5">Toque em Compartilhar → "Adicionar à Tela de Início"</p>
              <p className="text-[10px] text-yellow-400/60 mt-0.5">Use o Safari para instalar no iOS</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status PWA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
      >
        <h3 className="text-sm font-semibold text-white/70 mb-4">Status do PWA</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isStandalone
                ? <CheckCircle size={16} className="text-emerald-400" />
                : <AlertCircle size={16} className="text-gray-400" />}
              <span className="text-sm text-white/70">Modo de instalação</span>
            </div>
            <span className={`text-xs font-medium ${isStandalone ? 'text-emerald-400' : 'text-gray-400'}`}>
              {isStandalone ? 'Instalado como app' : 'Rodando no navegador'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon status={swStatus} />
              <span className="text-sm text-white/70">Service Worker</span>
            </div>
            <span className={`text-xs font-medium ${statusColor(swStatus)}`}>
              {statusText(swStatus, 'Ativo', 'Inativo')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon status={cacheStatus} />
              <span className="text-sm text-white/70">Cache offline</span>
            </div>
            <span className={`text-xs font-medium ${statusColor(cacheStatus)}`}>
              {statusText(cacheStatus, 'Ativo', 'Não disponível')}
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVerificarAtualizacoes}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 text-sm font-medium rounded-xl transition-colors"
        >
          <RefreshCw size={15} />
          Verificar atualizações
        </motion.button>
      </motion.div>
    </div>
  )
}
