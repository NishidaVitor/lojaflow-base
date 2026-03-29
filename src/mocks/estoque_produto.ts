import type { EstoqueProduto } from '@/types/produto'

export const estoqueProdutoMock: EstoqueProduto[] = [
  // p001 — Normal
  {
    id: 'e001', produto_id: 'p001', estoque_real: 15, estoque_reservado: 0,
    estoque_atual: 15, estoque_minimo: 10, estoque_maximo: 50,
    localizacao: 'Prateleira A1', atualizado_em: '28/03/2026 09:00',
  },
  // p002 — Normal
  {
    id: 'e002', produto_id: 'p002', estoque_real: 25, estoque_reservado: 2,
    estoque_atual: 23, estoque_minimo: 10, estoque_maximo: 60,
    localizacao: 'Prateleira A2', atualizado_em: '28/03/2026 09:00',
  },
  // p003 — Baixo (8 <= 10)
  {
    id: 'e003', produto_id: 'p003', estoque_real: 8, estoque_reservado: 0,
    estoque_atual: 8, estoque_minimo: 10, estoque_maximo: 40,
    localizacao: 'Prateleira A3', atualizado_em: '27/03/2026 15:30',
  },
  // p004 — Crítico (3 <= 10*0.5=5)
  {
    id: 'e004', produto_id: 'p004', estoque_real: 3, estoque_reservado: 0,
    estoque_atual: 3, estoque_minimo: 10, estoque_maximo: 50,
    localizacao: 'Prateleira B1', atualizado_em: '27/03/2026 12:00',
  },
  // p005 — Zerado
  {
    id: 'e005', produto_id: 'p005', estoque_real: 0, estoque_reservado: 0,
    estoque_atual: 0, estoque_minimo: 5, estoque_maximo: 30,
    localizacao: 'Prateleira B2', atualizado_em: '26/03/2026 18:00',
  },
  // p006 — Normal
  {
    id: 'e006', produto_id: 'p006', estoque_real: 20, estoque_reservado: 1,
    estoque_atual: 19, estoque_minimo: 8, estoque_maximo: 60,
    localizacao: 'Prateleira C1', atualizado_em: '28/03/2026 09:00',
  },
  // p007 — Crítico (2 <= 8*0.5=4)
  {
    id: 'e007', produto_id: 'p007', estoque_real: 2, estoque_reservado: 0,
    estoque_atual: 2, estoque_minimo: 8, estoque_maximo: 30,
    localizacao: 'Prateleira C2', atualizado_em: '25/03/2026 14:00',
  },
  // p008 — Normal
  {
    id: 'e008', produto_id: 'p008', estoque_real: 12, estoque_reservado: 0,
    estoque_atual: 12, estoque_minimo: 5, estoque_maximo: 40,
    localizacao: 'Prateleira C3', atualizado_em: '28/03/2026 09:00',
  },
  // p009 — Baixo (5 <= 8, > 4)
  {
    id: 'e009', produto_id: 'p009', estoque_real: 6, estoque_reservado: 1,
    estoque_atual: 5, estoque_minimo: 8, estoque_maximo: 40,
    localizacao: 'Estante D1', atualizado_em: '27/03/2026 10:00',
  },
  // p010 — Normal
  {
    id: 'e010', produto_id: 'p010', estoque_real: 18, estoque_reservado: 0,
    estoque_atual: 18, estoque_minimo: 10, estoque_maximo: 50,
    localizacao: 'Estante D2', atualizado_em: '28/03/2026 09:00',
  },
  // p011 — Zerado
  {
    id: 'e011', produto_id: 'p011', estoque_real: 0, estoque_reservado: 0,
    estoque_atual: 0, estoque_minimo: 6, estoque_maximo: 30,
    localizacao: 'Estante E1', atualizado_em: '24/03/2026 16:00',
  },
  // p012 — Normal
  {
    id: 'e012', produto_id: 'p012', estoque_real: 30, estoque_reservado: 3,
    estoque_atual: 27, estoque_minimo: 15, estoque_maximo: 80,
    localizacao: 'Estante E2', atualizado_em: '28/03/2026 09:00',
  },
]
