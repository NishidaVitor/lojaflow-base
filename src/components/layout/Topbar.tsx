import { useState } from 'react'
import { Menu, Search } from 'lucide-react'
import { SinoNotificacoes } from '@/components/topbar/SinoNotificacoes'
import { BuscaGlobal } from '@/components/topbar/BuscaGlobal'
import { BuscaMobileOverlay } from '@/components/topbar/BuscaMobileOverlay'
import { useBuscaGlobal } from '@/hooks/useBuscaGlobal'

interface TopbarProps {
  onMenuClick: () => void
}

function MobileBusca() {
  const [overlayAberto, setOverlayAberto] = useState(false)
  const {
    termo,
    setTermo,
    resultados,
    recentes,
    carregando,
    indiceSelecionado,
    selecionar,
    navegarTeclado,
    confirmarSelecao,
    limparRecentes,
  } = useBuscaGlobal()

  return (
    <>
      <button
        onClick={() => setOverlayAberto(true)}
        className="md:hidden p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Buscar"
      >
        <Search size={20} />
      </button>

      <BuscaMobileOverlay
        aberto={overlayAberto}
        onFechar={() => setOverlayAberto(false)}
        termo={termo}
        setTermo={setTermo}
        resultados={resultados}
        recentes={recentes}
        carregando={carregando}
        indiceSelecionado={indiceSelecionado}
        onSelecionar={selecionar}
        onLimparRecentes={limparRecentes}
        navegarTeclado={navegarTeclado}
        confirmarSelecao={confirmarSelecao}
      />
    </>
  )
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 h-14 bg-[#0F0F13]/80 backdrop-blur-md border-b border-[#2A2A3A]">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop search */}
      <BuscaGlobal />

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Mobile search icon */}
        <MobileBusca />

        {/* Notifications */}
        <SinoNotificacoes />

        {/* Avatar */}
        <button
          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-semibold ml-1 hover:opacity-90 transition-opacity"
          aria-label="Perfil do usuário"
        >
          VN
        </button>
      </div>
    </header>
  )
}
