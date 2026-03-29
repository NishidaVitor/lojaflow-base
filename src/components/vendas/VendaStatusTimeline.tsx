import { Check, X } from 'lucide-react'
import type { StatusVenda, StatusEvent } from '@/types/venda'

const ORDER: StatusVenda[] = ['orcamento', 'confirmada', 'em_separacao', 'entregue']

const labels: Record<StatusVenda, string> = {
  orcamento:    'Orçamento',
  confirmada:   'Confirmada',
  em_separacao: 'Em Separação',
  entregue:     'Entregue',
  cancelada:    'Cancelada',
  devolvida:    'Devolvida',
}

interface Props {
  timeline: StatusEvent[]
  statusAtual: StatusVenda
}

export function VendaStatusTimeline({ timeline, statusAtual }: Props) {
  const isFinal = statusAtual === 'cancelada' || statusAtual === 'devolvida'

  const getEvent = (s: StatusVenda) => timeline.find((e) => e.status === s)

  if (isFinal) {
    return (
      <div className="space-y-2">
        {timeline.map((ev, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                  ev.status === 'cancelada' || ev.status === 'devolvida'
                    ? 'bg-red-500/20 border-red-500/40 text-red-300'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                }`}
              >
                {ev.status === 'cancelada' || ev.status === 'devolvida' ? <X size={11} /> : <Check size={11} />}
              </div>
              {i < timeline.length - 1 && <div className="w-px h-4 bg-white/10 mt-1" />}
            </div>
            <div className="pb-2">
              <p className="text-xs font-medium text-white/80">{labels[ev.status]}</p>
              <p className="text-[10px] text-white/30">{ev.criado_em} · {ev.usuario}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const steps = ORDER
  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const ev = getEvent(step)
        const isDone = !!ev
        const isCurrent = step === statusAtual
        const isLast = i === steps.length - 1

        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  isDone
                    ? isCurrent
                      ? 'bg-indigo-500/30 border-indigo-400 text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/5 border-white/15 text-white/20'
                }`}
              >
                {isDone && !isCurrent ? <Check size={11} /> : <span>{i + 1}</span>}
              </div>
              {!isLast && (
                <div className={`w-px h-5 mt-0.5 ${isDone && !isCurrent ? 'bg-emerald-500/30' : 'bg-white/8'}`} />
              )}
            </div>
            <div className="pb-3">
              <p className={`text-xs font-medium ${isDone ? (isCurrent ? 'text-indigo-200' : 'text-white/70') : 'text-white/25'}`}>
                {labels[step]}
              </p>
              {ev ? (
                <p className="text-[10px] text-white/30">{ev.criado_em} · {ev.usuario}</p>
              ) : (
                <p className="text-[10px] text-white/15">Aguardando</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
