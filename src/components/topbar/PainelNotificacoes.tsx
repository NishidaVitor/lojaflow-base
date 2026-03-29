import { motion } from 'framer-motion'
import { BellOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ItemNotificacao } from './ItemNotificacao'
import type { Notificacao, TipoNotificacao } from '@/types/notificacao'

const MOCK_NOW = new Date('2026-03-29T14:00:00')

type DateGroup = 'hoje' | 'ontem' | 'semana' | 'antigas'

const GROUP_LABELS: Record<DateGroup, string> = {
  hoje: 'Hoje',
  ontem: 'Ontem',
  semana: 'Esta semana',
  antigas: 'Mais antigas',
}

const GROUP_ORDER: DateGroup[] = ['hoje', 'ontem', 'semana', 'antigas']

function getDateGroup(dateStr: string): DateGroup {
  const [datePart] = dateStr.split(' ')
  const [day, mon, yr] = datePart.split('/')
  const date = new Date(`${yr}-${mon}-${day}T00:00:00`)
  const now = new Date(MOCK_NOW)
  now.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
  if (diffDays === 0) return 'hoje'
  if (diffDays === 1) return 'ontem'
  if (diffDays < 7) return 'semana'
  return 'antigas'
}

const TABS: { id: TipoNotificacao | 'todas'; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'venda', label: 'Vendas' },
  { id: 'estoque', label: 'Estoque' },
  { id: 'cliente', label: 'Clientes' },
  { id: 'sistema', label: 'Sistema' },
  { id: 'pagamento', label: 'Pagamentos' },
]

interface Props {
  filtradas: Notificacao[]
  naoLidas: number
  filtroAtivo: TipoNotificacao | 'todas'
  setFiltroAtivo: (v: TipoNotificacao | 'todas') => void
  marcarComoLida: (id: string) => void
  marcarTodasComoLidas: () => void
  removerNotificacao: (id: string) => void
  onClose: () => void
}

export function PainelNotificacoes({
  filtradas,
  naoLidas,
  filtroAtivo,
  setFiltroAtivo,
  marcarComoLida,
  marcarTodasComoLidas,
  removerNotificacao,
  onClose,
}: Props) {
  const navigate = useNavigate()

  // Group by date
  const grupos = GROUP_ORDER.map((g) => ({
    grupo: g,
    label: GROUP_LABELS[g],
    items: filtradas.filter((n) => getDateGroup(n.criado_em) === g),
  })).filter((g) => g.items.length > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute top-12 right-0 w-[380px] max-w-[calc(100vw-1rem)] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50"
      style={{ transformOrigin: 'top right' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">Notificações</span>
          {naoLidas > 0 && (
            <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold text-indigo-300 bg-indigo-500/20 rounded-md">
              {naoLidas}
            </span>
          )}
        </div>
        {naoLidas > 0 && (
          <button
            onClick={marcarTodasComoLidas}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0.5 overflow-x-auto px-3 py-2 border-b border-white/5 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFiltroAtivo(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
              filtroAtivo === tab.id
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div
        className="overflow-y-auto max-h-80"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}
      >
        {filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <BellOff size={32} className="text-white/15 mb-3" />
            <p className="text-sm text-white/40">
              {filtroAtivo === 'todas'
                ? 'Nenhuma notificação'
                : `Nenhuma notificação de ${TABS.find((t) => t.id === filtroAtivo)?.label.toLowerCase()}`}
            </p>
            {filtroAtivo !== 'todas' && (
              <button
                onClick={() => setFiltroAtivo('todas')}
                className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Ver todas
              </button>
            )}
          </div>
        ) : (
          grupos.map((grupo) => (
            <div key={grupo.grupo}>
              {/* Date separator */}
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                  {grupo.label}
                </span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              {grupo.items.map((n) => (
                <ItemNotificacao
                  key={n.id}
                  notificacao={n}
                  onMarcarLida={marcarComoLida}
                  onRemover={removerNotificacao}
                  onClose={onClose}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/8 text-center">
        <button
          onClick={() => {
            navigate('/notificacoes')
            onClose()
          }}
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Ver todas as notificações
        </button>
      </div>
    </motion.div>
  )
}
