import type { FormaPagamento } from '@/types/venda'
import type { ItemRascunho } from './ItemVendaCard'

const formaOptions: { value: FormaPagamento; label: string; parcelas?: number[] }[] = [
  { value: 'dinheiro',       label: 'Dinheiro' },
  { value: 'pix',            label: 'Pix' },
  { value: 'cartao_debito',  label: 'Cartão de Débito' },
  { value: 'cartao_credito', label: 'Cartão de Crédito', parcelas: [1, 2, 3, 4, 5, 6, 8, 10, 12] },
  { value: 'boleto',         label: 'Boleto' },
  { value: 'crediario',      label: 'Crediário', parcelas: [2, 3, 4, 5, 6] },
]

interface Props {
  itens: ItemRascunho[]
  descontoGeral: number
  formaPagamento: FormaPagamento
  parcelas: number | null
  onDescontoChange: (v: number) => void
  onFormaPagamentoChange: (v: FormaPagamento) => void
  onParcelasChange: (v: number | null) => void
  onSubmit: () => void
  submitting?: boolean
  isEdit?: boolean
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ResumoVenda({
  itens, descontoGeral, formaPagamento, parcelas,
  onDescontoChange, onFormaPagamentoChange, onParcelasChange,
  onSubmit, submitting, isEdit,
}: Props) {
  const subtotal = itens.reduce((acc, it) => acc + (it.preco_unitario - it.desconto_item) * it.quantidade, 0)
  const total = Math.max(0, subtotal - descontoGeral)

  const opcaoAtual = formaOptions.find((o) => o.value === formaPagamento)!
  const podeParcelas = !!opcaoAtual.parcelas

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-5 sticky top-6">
      <h3 className="text-sm font-semibold text-white">Resumo da Venda</h3>

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-white/50">
          <span>Subtotal</span>
          <span>{fmt(subtotal)}</span>
        </div>

        {/* Desconto geral */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-white/50 shrink-0">Desconto geral</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/30">R$</span>
            <input
              type="number"
              min={0}
              step={0.01}
              max={subtotal}
              value={descontoGeral}
              onChange={(e) => onDescontoChange(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-20 text-right bg-white/5 border border-white/10 rounded-md text-xs text-white/80 px-2 py-1 outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-1">
          <span className="text-sm font-semibold text-white">Total</span>
          <span className="text-lg font-bold text-white">{fmt(total)}</span>
        </div>
      </div>

      {/* Forma de pagamento */}
      <div>
        <label className="block text-xs font-medium text-white/40 mb-1.5">
          Forma de Pagamento <span className="text-red-400">*</span>
        </label>
        <select
          value={formaPagamento}
          onChange={(e) => {
            const f = e.target.value as FormaPagamento
            onFormaPagamentoChange(f)
            const op = formaOptions.find((o) => o.value === f)
            if (!op?.parcelas) onParcelasChange(null)
            else onParcelasChange(op.parcelas[0])
          }}
          className="w-full bg-white/10 border border-white/15 focus:border-indigo-500/50 rounded-lg px-3 py-2 text-sm text-white outline-none transition-all"
        >
          {formaOptions.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#1C1C26]">{o.label}</option>
          ))}
        </select>
      </div>

      {/* Parcelas */}
      {podeParcelas && (
        <div>
          <label className="block text-xs font-medium text-white/40 mb-1.5">Parcelas</label>
          <select
            value={parcelas ?? 1}
            onChange={(e) => onParcelasChange(parseInt(e.target.value))}
            className="w-full bg-white/10 border border-white/15 focus:border-indigo-500/50 rounded-lg px-3 py-2 text-sm text-white outline-none transition-all"
          >
            {opcaoAtual.parcelas!.map((n) => (
              <option key={n} value={n} className="bg-[#1C1C26]">
                {n}x {fmt(total / n)}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting || itens.length === 0}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
      >
        {submitting ? 'Salvando…' : isEdit ? 'Salvar Alterações' : 'Criar Venda'}
      </button>
    </div>
  )
}
