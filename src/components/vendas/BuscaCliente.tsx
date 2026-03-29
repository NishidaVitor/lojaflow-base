import { useState, useRef, useEffect } from 'react'
import { Search, UserRound, X } from 'lucide-react'
import { clientesStore } from '@/store/clientesStore'
import type { Cliente } from '@/types/cliente'

interface Props {
  value: { id: string | null; nome: string; telefone: string | null } | null
  onChange: (cliente: { id: string | null; nome: string; telefone: string | null }) => void
}

export function BuscaCliente({ value, onChange }: Props) {
  const [query, setQuery] = useState('')
  const [aberto, setAberto] = useState(false)
  const [modoAvulso, setModoAvulso] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const termo = query.toLowerCase().trim()
  const resultados: Cliente[] = termo.length < 1 ? [] : [...clientesStore.values()]
    .filter((c) => c.status === 'ativo' && (c.nome.toLowerCase().includes(termo) || c.telefone.includes(termo)))
    .slice(0, 6)

  function select(c: Cliente) {
    onChange({ id: c.id, nome: c.nome, telefone: c.telefone })
    setQuery('')
    setAberto(false)
    setModoAvulso(false)
  }

  function limpar() {
    onChange({ id: null, nome: '', telefone: null })
    setQuery('')
    setModoAvulso(false)
  }

  // Avulso mode
  if (modoAvulso) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={value?.nome ?? ''}
          onChange={(e) => onChange({ id: null, nome: e.target.value, telefone: value?.telefone ?? null })}
          placeholder="Nome do cliente (avulso)"
          className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 text-white/80 placeholder:text-white/20 text-sm rounded-xl px-4 py-2.5 outline-none transition-all"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={value?.telefone ?? ''}
            onChange={(e) => onChange({ id: value?.id ?? null, nome: value?.nome ?? '', telefone: e.target.value || null })}
            placeholder="Telefone (opcional)"
            className="flex-1 bg-white/5 border border-white/10 focus:border-indigo-500/50 text-white/80 placeholder:text-white/20 text-sm rounded-xl px-4 py-2.5 outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => setModoAvulso(false)}
            className="px-3 py-2.5 text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-xl transition-colors"
          >
            Buscar cadastro
          </button>
        </div>
      </div>
    )
  }

  // Selected state
  if (value?.id) {
    return (
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
        <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-semibold shrink-0">
          {value.nome.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/80 truncate">{value.nome}</p>
          {value.telefone && <p className="text-[10px] text-white/35">{value.telefone}</p>}
        </div>
        <button type="button" onClick={limpar} className="text-white/25 hover:text-white/60 transition-colors">
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div ref={ref} className="space-y-2">
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setAberto(true) }}
          onFocus={() => setAberto(true)}
          placeholder="Buscar cliente cadastrado…"
          className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 text-white/80 placeholder:text-white/20 text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all"
        />
      </div>

      {aberto && resultados.length > 0 && (
        <div className="absolute z-40 w-full bg-[#1C1C26] border border-[#2A2A3A] rounded-xl shadow-2xl overflow-hidden">
          {resultados.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => select(c)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-semibold shrink-0">
                {c.nome.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white/80 truncate">{c.nome}</p>
                <p className="text-[10px] text-white/30">{c.telefone} · {c.cidade}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => { setModoAvulso(true); setAberto(false) }}
        className="flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white/60 transition-colors"
      >
        <UserRound size={12} /> Adicionar cliente avulso (sem cadastro)
      </button>
    </div>
  )
}
