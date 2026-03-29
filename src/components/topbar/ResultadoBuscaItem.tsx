import { User, Package, ShoppingBag, ArrowLeftRight, ChevronRight } from 'lucide-react'
import type { ResultadoBusca } from '@/types/busca'

const ICONE_MAP = {
  cliente: User,
  produto: Package,
  venda: ShoppingBag,
  movimentacao: ArrowLeftRight,
}

function HighlightedText({ text, termo }: { text: string; termo: string }) {
  if (!termo || termo.length < 2) return <>{text}</>
  const idx = text.toLowerCase().indexOf(termo.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-white font-semibold bg-indigo-500/20 rounded px-0.5">
        {text.slice(idx, idx + termo.length)}
      </span>
      {text.slice(idx + termo.length)}
    </>
  )
}

interface Props {
  resultado: ResultadoBusca
  termo: string
  isSelected: boolean
  onClick: () => void
}

export function ResultadoBuscaItem({ resultado, termo, isSelected, onClick }: Props) {
  const Icon = ICONE_MAP[resultado.tipo]

  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border-l-2 ${
        isSelected
          ? 'bg-indigo-500/20 border-indigo-400'
          : 'hover:bg-white/5 border-transparent hover:border-indigo-500/50'
      }`}
    >
      {/* Visual */}
      {resultado.thumbnail ? (
        <img
          src={resultado.thumbnail}
          alt={resultado.titulo}
          className="w-9 h-9 rounded-lg object-cover shrink-0"
        />
      ) : (
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border"
          style={{
            backgroundColor: `${resultado.icone_cor}20`,
            borderColor: `${resultado.icone_cor}40`,
          }}
        >
          <Icon size={15} style={{ color: resultado.icone_cor }} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/60 truncate leading-snug">
          <HighlightedText text={resultado.titulo} termo={termo} />
        </p>
        <p className="text-[11px] text-white/30 truncate mt-0.5">{resultado.subtitulo}</p>
      </div>

      {/* Badge */}
      <span
        className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-md border shrink-0 ${resultado.badge_cor}`}
      >
        {resultado.badge_texto}
      </span>

      {/* Arrow */}
      <ChevronRight
        size={14}
        className="text-white/20 group-hover:text-white/50 shrink-0 transition-colors"
      />
    </div>
  )
}
