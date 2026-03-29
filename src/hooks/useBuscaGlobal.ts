import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { buscarGlobal } from '@/utils/buscaGlobal'
import type { ResultadoBusca } from '@/types/busca'

const RECENTES_KEY = 'lojaflow_busca_recentes'
const MAX_RECENTES = 5

function carregarRecentes(): ResultadoBusca[] {
  try {
    const raw = localStorage.getItem(RECENTES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ResultadoBusca[]
  } catch {
    return []
  }
}

function salvarRecentes(recentes: ResultadoBusca[]) {
  try {
    localStorage.setItem(RECENTES_KEY, JSON.stringify(recentes))
  } catch {
    // ignore storage errors
  }
}

export function useBuscaGlobal() {
  const navigate = useNavigate()
  const [termo, setTermoRaw] = useState('')
  const [resultados, setResultados] = useState<ResultadoBusca[]>([])
  const [carregando, setCarregando] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [indiceSelecionado, setIndiceSelecionado] = useState(-1)
  const [recentes, setRecentes] = useState<ResultadoBusca[]>(carregarRecentes)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setTermo = useCallback((val: string) => {
    setTermoRaw(val)
    setIndiceSelecionado(-1)
    if (val.length < 2) {
      setResultados([])
      setCarregando(false)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      return
    }
    setCarregando(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setResultados(buscarGlobal(val))
      setCarregando(false)
    }, 200)
  }, [])

  const selecionar = useCallback(
    (resultado: ResultadoBusca) => {
      setRecentes((prev) => {
        const sem = prev.filter((r) => r.id !== resultado.id)
        const novos = [resultado, ...sem].slice(0, MAX_RECENTES)
        salvarRecentes(novos)
        return novos
      })
      navigate(resultado.rota)
      setTermoRaw('')
      setResultados([])
      setAberto(false)
      setIndiceSelecionado(-1)
    },
    [navigate]
  )

  const limparRecentes = useCallback(() => {
    setRecentes([])
    salvarRecentes([])
  }, [])

  const fechar = useCallback(() => {
    setAberto(false)
    setIndiceSelecionado(-1)
  }, [])

  const abrir = useCallback(() => {
    setAberto(true)
  }, [])

  const lista = termo.length >= 2 ? resultados : recentes

  const navegarTeclado = useCallback(
    (dir: 'up' | 'down') => {
      if (!lista.length) return
      setIndiceSelecionado((prev) => {
        if (dir === 'down') return Math.min(prev + 1, lista.length - 1)
        return Math.max(prev - 1, -1)
      })
    },
    [lista]
  )

  const confirmarSelecao = useCallback(() => {
    if (indiceSelecionado >= 0 && indiceSelecionado < lista.length) {
      selecionar(lista[indiceSelecionado])
    }
  }, [indiceSelecionado, lista, selecionar])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return {
    termo,
    setTermo,
    resultados,
    carregando,
    aberto,
    abrir,
    fechar,
    indiceSelecionado,
    recentes,
    limparRecentes,
    navegarTeclado,
    confirmarSelecao,
    selecionar,
    lista,
  }
}
