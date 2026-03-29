import { Trash2, Minus, Plus } from 'lucide-react'

export interface ItemRascunho {
  produto_id: string
  produto_nome: string
  produto_sku: string
  produto_imagem_url: string
  quantidade: number
  preco_unitario: number
  desconto_item: number
  estoque_disponivel: number
}

interface Props {
  item: ItemRascunho
  onChange: (updated: ItemRascunho) => void
  onRemove: () => void
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ItemVendaCard({ item, onChange, onRemove }: Props) {
  const subtotal = (item.preco_unitario - item.desconto_item) * item.quantidade

  function setQtd(q: number) {
    if (q < 1) return
    onChange({ ...item, quantidade: Math.min(q, item.estoque_disponivel) })
  }

  function setDesconto(v: number) {
    onChange({ ...item, desconto_item: Math.max(0, Math.min(v, item.preco_unitario)) })
  }

  return (
    <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
      <img
        src={item.produto_imagem_url}
        alt={item.produto_nome}
        className="w-12 h-12 rounded-lg object-cover shrink-0 bg-white/5"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white/80 truncate">{item.produto_nome}</p>
        <p className="text-[10px] text-white/35 mb-2">{item.produto_sku}</p>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Quantidade */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setQtd(item.quantidade - 1)}
              className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors"
            >
              <Minus size={11} />
            </button>
            <input
              type="number"
              min={1}
              max={item.estoque_disponivel}
              value={item.quantidade}
              onChange={(e) => setQtd(parseInt(e.target.value) || 1)}
              className="w-10 text-center bg-white/5 border border-white/10 rounded-md text-xs text-white/80 py-0.5 outline-none focus:border-indigo-500/50"
            />
            <button
              type="button"
              onClick={() => setQtd(item.quantidade + 1)}
              disabled={item.quantidade >= item.estoque_disponivel}
              className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Preço unitário */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/30">R$</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={item.preco_unitario}
              onChange={(e) => onChange({ ...item, preco_unitario: parseFloat(e.target.value) || 0 })}
              className="w-20 bg-white/5 border border-white/10 rounded-md text-xs text-white/80 px-2 py-0.5 outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* Desconto por item */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/30">desc.</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={item.desconto_item}
              onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
              className="w-16 bg-white/5 border border-white/10 rounded-md text-xs text-white/80 px-2 py-0.5 outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        {item.quantidade >= item.estoque_disponivel && (
          <p className="text-[10px] text-amber-400/70 mt-1.5">Máx. disponível: {item.estoque_disponivel}</p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          type="button"
          onClick={onRemove}
          className="text-white/20 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
        <p className="text-sm font-semibold text-white/80">{fmt(subtotal)}</p>
      </div>
    </div>
  )
}
