import { useState, useRef, useEffect } from 'react'
import { Search, Package } from 'lucide-react'
import { produtosStore, estoqueStore } from '@/store/produtosStore'

interface Resultado {
  id: string
  nome: string
  sku: string
  preco_venda: number
  imagem_url: string
  estoque_atual: number
}

interface Props {
  onSelect: (produto: Resultado) => void
  placeholder?: string
}

export function BuscaProduto({ onSelect, placeholder = 'Buscar produto por nome ou SKU…' }: Props) {
  const [query, setQuery] = useState('')
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const termo = query.toLowerCase().trim()
  const resultados: Resultado[] = termo.length < 1 ? [] : [...produtosStore.values()]
    .filter((p) => p.ativo && (p.nome.toLowerCase().includes(termo) || p.sku.toLowerCase().includes(termo)))
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      nome: p.nome,
      sku: p.sku,
      preco_venda: p.preco_promocional ?? p.preco_venda,
      imagem_url: p.imagem_url,
      estoque_atual: estoqueStore.get(p.id)?.estoque_atual ?? 0,
    }))

  function select(r: Resultado) {
    onSelect(r)
    setQuery('')
    setAberto(false)
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setAberto(true) }}
          onFocus={() => setAberto(true)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 text-white/80 placeholder:text-white/20 text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all"
        />
      </div>

      {aberto && resultados.length > 0 && (
        <div className="absolute z-40 mt-1 w-full bg-[#1C1C26] border border-[#2A2A3A] rounded-xl shadow-2xl overflow-hidden">
          {resultados.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => select(r)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
            >
              <img src={r.imagem_url} alt={r.nome} className="w-8 h-8 rounded-lg object-cover shrink-0 bg-white/5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white/80 truncate">{r.nome}</p>
                <p className="text-[10px] text-white/30">{r.sku}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-semibold text-white/70">
                  {r.preco_venda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className={`text-[10px] ${r.estoque_atual > 0 ? 'text-emerald-400/60' : 'text-red-400/60'}`}>
                  {r.estoque_atual > 0 ? `${r.estoque_atual} em estoque` : 'Sem estoque'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {aberto && termo.length >= 1 && resultados.length === 0 && (
        <div className="absolute z-40 mt-1 w-full bg-[#1C1C26] border border-[#2A2A3A] rounded-xl shadow-2xl px-4 py-5 flex flex-col items-center gap-2">
          <Package size={20} className="text-white/20" />
          <p className="text-xs text-white/30">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  )
}
