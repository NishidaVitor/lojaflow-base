import { useState, useEffect, useCallback } from 'react'
import { notificacoesMock } from '@/mocks/notificacoes'
import type { Notificacao, TipoNotificacao } from '@/types/notificacao'

const NOVA_NOTIFICACAO: Notificacao = {
  id: 'n-sim-001',
  tipo: 'venda',
  titulo: 'Nova venda registrada',
  mensagem: 'VND-013 — R$ 280,00 para Juliana Martins',
  lida: false,
  criado_em: '29/03/2026 14:35',
  referencia_id: 'vnd-013',
  referencia_tipo: 'venda',
  referencia_rota: '/vendas/vnd-013',
  icone_cor: '#4F46E5',
}

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesMock)
  const [filtroAtivo, setFiltroAtivo] = useState<TipoNotificacao | 'todas'>('todas')

  const naoLidas = notificacoes.filter((n) => !n.lida).length

  // Simulate new notification arriving after 30s
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotificacoes((prev) => {
        if (prev.some((n) => n.id === NOVA_NOTIFICACAO.id)) return prev
        return [NOVA_NOTIFICACAO, ...prev]
      })
    }, 30000)
    return () => clearTimeout(timer)
  }, [])

  const marcarComoLida = useCallback((id: string) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    )
  }, [])

  const marcarTodasComoLidas = useCallback(() => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })))
  }, [])

  const removerNotificacao = useCallback((id: string) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const filtradas =
    filtroAtivo === 'todas'
      ? notificacoes
      : notificacoes.filter((n) => n.tipo === filtroAtivo)

  return {
    notificacoes,
    filtradas,
    naoLidas,
    filtroAtivo,
    setFiltroAtivo,
    marcarComoLida,
    marcarTodasComoLidas,
    removerNotificacao,
  }
}
