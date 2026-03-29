import { useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Package,
  UserPlus,
  CreditCard,
  Settings,
  Users,
  ExternalLink,
  X,
} from 'lucide-react'
import type { Notificacao } from '@/types/notificacao'

// Reference date for the mock (29/03/2026)
const MOCK_NOW = new Date('2026-03-29T14:00:00')

function formatTimeAgo(dateStr: string): string {
  const [datePart, timePart = '00:00'] = dateStr.split(' ')
  const [day, mon, yr] = datePart.split('/')
  const date = new Date(`${yr}-${mon}-${day}T${timePart}:00`)
  const diffMs = MOCK_NOW.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMin / 60)
  const diffD = Math.floor(diffH / 24)

  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `há ${diffMin}min`
  if (diffH < 24) return `há ${diffH}h`
  if (diffD === 1) return 'ontem'
  if (diffD < 7) return `há ${diffD} dias`
  return `${day}/${mon}`
}

const ICONE_MAP = {
  venda: ShoppingBag,
  estoque: Package,
  cliente: UserPlus,
  pagamento: CreditCard,
  sistema: Settings,
  usuario: Users,
}

interface Props {
  notificacao: Notificacao
  onMarcarLida: (id: string) => void
  onRemover: (id: string) => void
  onClose: () => void
}

export function ItemNotificacao({ notificacao, onMarcarLida, onRemover, onClose }: Props) {
  const navigate = useNavigate()
  const Icon = ICONE_MAP[notificacao.tipo]

  function handleClick() {
    if (!notificacao.lida) onMarcarLida(notificacao.id)
    if (notificacao.referencia_rota) {
      navigate(notificacao.referencia_rota)
      onClose()
    }
  }

  function handleExternalLink(e: React.MouseEvent) {
    e.stopPropagation()
    if (!notificacao.lida) onMarcarLida(notificacao.id)
    if (notificacao.referencia_rota) {
      navigate(notificacao.referencia_rota)
      onClose()
    }
  }

  function handleRemover(e: React.MouseEvent) {
    e.stopPropagation()
    onRemover(notificacao.id)
  }

  return (
    <div
      onClick={handleClick}
      className={`group flex items-start gap-3 px-4 py-3 transition-colors ${
        notificacao.referencia_rota ? 'cursor-pointer' : 'cursor-default'
      } hover:bg-white/5 ${!notificacao.lida ? 'bg-indigo-500/[0.04]' : ''}`}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 border"
        style={{
          backgroundColor: `${notificacao.icone_cor}20`,
          borderColor: `${notificacao.icone_cor}40`,
        }}
      >
        <Icon size={15} style={{ color: notificacao.icone_cor }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug truncate ${
            notificacao.lida ? 'text-white/70 font-medium' : 'text-white font-semibold'
          }`}
        >
          {notificacao.titulo}
        </p>
        <p className="text-xs text-white/40 mt-0.5 line-clamp-2 leading-relaxed">
          {notificacao.mensagem}
        </p>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/30 whitespace-nowrap">
            {formatTimeAgo(notificacao.criado_em)}
          </span>
          {!notificacao.lida && (
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {notificacao.referencia_rota && (
            <button
              onClick={handleExternalLink}
              className="p-1 rounded text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
              aria-label="Ver detalhes"
            >
              <ExternalLink size={12} />
            </button>
          )}
          <button
            onClick={handleRemover}
            className="p-1 rounded text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            aria-label="Remover"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
