import type { Venda } from '@/types/venda'

export const vendasMock: Venda[] = [
  // VND-001 — Diego Santos — Carteira Slim — entregue
  {
    id: 'vnd-001', numero: 'VND-001',
    cliente_id: 'c010', cliente_nome: 'Diego Santos', cliente_telefone: '(81) 90987-6543',
    itens: [
      { id: 'i001a', venda_id: 'vnd-001', produto_id: 'p008', produto_nome: 'Carteira Slim Masculina',
        produto_sku: 'ACE-003-PT', produto_imagem_url: 'https://picsum.photos/seed/prod8/200/200',
        quantidade: 2, preco_unitario: 69.9, desconto_item: 0, subtotal: 139.8 },
    ],
    subtotal: 139.8, desconto_geral: 0, total: 139.8,
    forma_pagamento: 'pix', parcelas: null, status: 'entregue',
    timeline: [
      { status: 'orcamento',    criado_em: '12/01/2026 10:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada',   criado_em: '12/01/2026 10:15', usuario: 'Vitor Nishida' },
      { status: 'em_separacao', criado_em: '12/01/2026 10:30', usuario: 'Vitor Nishida' },
      { status: 'entregue',     criado_em: '12/01/2026 11:00', usuario: 'Vitor Nishida' },
    ],
    observacoes: null, vendedor: 'Vitor Nishida',
    criado_em: '12/01/2026 10:00', atualizado_em: '12/01/2026 11:00',
  },

  // VND-002 — Ana Lima — Cinto de Couro — entregue (devolução parcial tratada em movimentação)
  {
    id: 'vnd-002', numero: 'VND-002',
    cliente_id: 'c001', cliente_nome: 'Ana Lima', cliente_telefone: '(11) 99234-5678',
    itens: [
      { id: 'i002a', venda_id: 'vnd-002', produto_id: 'p006', produto_nome: 'Cinto de Couro Clássico',
        produto_sku: 'ACE-001-MA', produto_imagem_url: 'https://picsum.photos/seed/prod6/200/200',
        quantidade: 6, preco_unitario: 89.9, desconto_item: 0, subtotal: 539.4 },
    ],
    subtotal: 539.4, desconto_geral: 20, total: 519.4,
    forma_pagamento: 'cartao_credito', parcelas: 3, status: 'entregue',
    timeline: [
      { status: 'orcamento',    criado_em: '20/03/2026 09:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada',   criado_em: '20/03/2026 09:20', usuario: 'Vitor Nishida' },
      { status: 'em_separacao', criado_em: '20/03/2026 14:00', usuario: 'Vitor Nishida' },
      { status: 'entregue',     criado_em: '26/03/2026 13:00', usuario: 'Vitor Nishida' },
    ],
    observacoes: 'Cliente pediu embrulho para presente.', vendedor: 'Vitor Nishida',
    criado_em: '20/03/2026 09:00', atualizado_em: '26/03/2026 13:00',
  },

  // VND-003 — Thiago Ramos — Calça Jeans — entregue
  {
    id: 'vnd-003', numero: 'VND-003',
    cliente_id: 'c008', cliente_nome: 'Thiago Ramos', cliente_telefone: '(62) 92109-8765',
    itens: [
      { id: 'i003a', venda_id: 'vnd-003', produto_id: 'p004', produto_nome: 'Calça Jeans Slim Masculina',
        produto_sku: 'CAL-001-AZ', produto_imagem_url: 'https://picsum.photos/seed/prod4/200/200',
        quantidade: 8, preco_unitario: 199.9, desconto_item: 0, subtotal: 1599.2 },
    ],
    subtotal: 1599.2, desconto_geral: 100, total: 1499.2,
    forma_pagamento: 'cartao_credito', parcelas: 6, status: 'entregue',
    timeline: [
      { status: 'orcamento',    criado_em: '01/02/2026 10:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada',   criado_em: '01/02/2026 10:30', usuario: 'Vitor Nishida' },
      { status: 'em_separacao', criado_em: '05/02/2026 09:00', usuario: 'Vitor Nishida' },
      { status: 'entregue',     criado_em: '10/02/2026 11:00', usuario: 'Vitor Nishida' },
    ],
    observacoes: null, vendedor: 'Vitor Nishida',
    criado_em: '01/02/2026 10:00', atualizado_em: '10/02/2026 11:00',
  },

  // VND-004 — Mariana Souza — Calça Moletom + Bolsa Tote — entregue
  {
    id: 'vnd-004', numero: 'VND-004',
    cliente_id: 'c005', cliente_nome: 'Mariana Souza', cliente_telefone: '(51) 95432-1098',
    itens: [
      { id: 'i004a', venda_id: 'vnd-004', produto_id: 'p005', produto_nome: 'Calça Moletom Feminina',
        produto_sku: 'CAL-002-PR', produto_imagem_url: 'https://picsum.photos/seed/prod5/200/200',
        quantidade: 3, preco_unitario: 139.9, desconto_item: 0, subtotal: 419.7 },
      { id: 'i004b', venda_id: 'vnd-004', produto_id: 'p011', produto_nome: 'Bolsa Tote de Lona',
        produto_sku: 'BOL-001-BE', produto_imagem_url: 'https://picsum.photos/seed/prod11/200/200',
        quantidade: 2, preco_unitario: 169.9, desconto_item: 10, subtotal: 319.8 },
    ],
    subtotal: 739.5, desconto_geral: 0, total: 739.5,
    forma_pagamento: 'pix', parcelas: null, status: 'entregue',
    timeline: [
      { status: 'orcamento',    criado_em: '10/03/2026 14:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada',   criado_em: '10/03/2026 14:30', usuario: 'Vitor Nishida' },
      { status: 'em_separacao', criado_em: '15/03/2026 09:00', usuario: 'Vitor Nishida' },
      { status: 'entregue',     criado_em: '20/03/2026 08:00', usuario: 'Vitor Nishida' },
    ],
    observacoes: 'Entregar no endereço do trabalho.', vendedor: 'Vitor Nishida',
    criado_em: '10/03/2026 14:00', atualizado_em: '20/03/2026 08:00',
  },

  // VND-005 — Fernanda Alves — Calça Jeans — cancelada
  {
    id: 'vnd-005', numero: 'VND-005',
    cliente_id: 'c007', cliente_nome: 'Fernanda Alves', cliente_telefone: '(85) 93210-9876',
    itens: [
      { id: 'i005a', venda_id: 'vnd-005', produto_id: 'p004', produto_nome: 'Calça Jeans Slim Masculina',
        produto_sku: 'CAL-001-AZ', produto_imagem_url: 'https://picsum.photos/seed/prod4/200/200',
        quantidade: 7, preco_unitario: 239.9, desconto_item: 0, subtotal: 1679.3 },
    ],
    subtotal: 1679.3, desconto_geral: 0, total: 1679.3,
    forma_pagamento: 'boleto', parcelas: null, status: 'cancelada',
    timeline: [
      { status: 'orcamento',  criado_em: '01/03/2026 11:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada', criado_em: '01/03/2026 11:30', usuario: 'Vitor Nishida' },
      { status: 'cancelada',  criado_em: '08/03/2026 09:00', usuario: 'Vitor Nishida' },
    ],
    observacoes: 'Cliente desistiu — boleto não pago.', vendedor: 'Vitor Nishida',
    criado_em: '01/03/2026 11:00', atualizado_em: '08/03/2026 09:00',
  },

  // VND-006 — Rafael Oliveira — Camiseta Polo — entregue
  {
    id: 'vnd-006', numero: 'VND-006',
    cliente_id: 'c006', cliente_nome: 'Rafael Oliveira', cliente_telefone: '(71) 94321-0987',
    itens: [
      { id: 'i006a', venda_id: 'vnd-006', produto_id: 'p003', produto_nome: 'Camiseta Polo Slim',
        produto_sku: 'CAM-003-AZ', produto_imagem_url: 'https://picsum.photos/seed/prod3/200/200',
        quantidade: 3, preco_unitario: 219.9, desconto_item: 20, subtotal: 599.7 },
    ],
    subtotal: 599.7, desconto_geral: 0, total: 599.7,
    forma_pagamento: 'cartao_debito', parcelas: null, status: 'entregue',
    timeline: [
      { status: 'orcamento',    criado_em: '20/03/2026 08:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada',   criado_em: '20/03/2026 08:30', usuario: 'Vitor Nishida' },
      { status: 'em_separacao', criado_em: '24/03/2026 10:00', usuario: 'Vitor Nishida' },
      { status: 'entregue',     criado_em: '25/03/2026 10:15', usuario: 'Vitor Nishida' },
    ],
    observacoes: null, vendedor: 'Vitor Nishida',
    criado_em: '20/03/2026 08:00', atualizado_em: '25/03/2026 10:15',
  },

  // VND-007 — Mariana Souza — Camiseta Estampada Urban — devolvida
  {
    id: 'vnd-007', numero: 'VND-007',
    cliente_id: 'c005', cliente_nome: 'Mariana Souza', cliente_telefone: '(51) 95432-1098',
    itens: [
      { id: 'i007a', venda_id: 'vnd-007', produto_id: 'p002', produto_nome: 'Camiseta Estampada Urban',
        produto_sku: 'CAM-002-PR', produto_imagem_url: 'https://picsum.photos/seed/prod2/200/200',
        quantidade: 1, preco_unitario: 79.9, desconto_item: 0, subtotal: 79.9 },
    ],
    subtotal: 79.9, desconto_geral: 0, total: 79.9,
    forma_pagamento: 'dinheiro', parcelas: null, status: 'devolvida',
    timeline: [
      { status: 'orcamento',    criado_em: '14/03/2026 11:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada',   criado_em: '14/03/2026 11:15', usuario: 'Vitor Nishida' },
      { status: 'em_separacao', criado_em: '14/03/2026 14:00', usuario: 'Vitor Nishida' },
      { status: 'entregue',     criado_em: '15/03/2026 09:00', usuario: 'Vitor Nishida' },
      { status: 'devolvida',    criado_em: '21/03/2026 10:30', usuario: 'Vitor Nishida' },
    ],
    observacoes: 'Cliente devolveu tamanho errado.', vendedor: 'Vitor Nishida',
    criado_em: '14/03/2026 11:00', atualizado_em: '21/03/2026 10:30',
  },

  // VND-008 — Ana Lima — Camiseta Básica + Tênis + Bolsa Clutch — em_separacao
  {
    id: 'vnd-008', numero: 'VND-008',
    cliente_id: 'c001', cliente_nome: 'Ana Lima', cliente_telefone: '(11) 99234-5678',
    itens: [
      { id: 'i008a', venda_id: 'vnd-008', produto_id: 'p001', produto_nome: 'Camiseta Básica Branca',
        produto_sku: 'CAM-001-BR', produto_imagem_url: 'https://picsum.photos/seed/prod1/200/200',
        quantidade: 3, preco_unitario: 59.9, desconto_item: 0, subtotal: 179.7 },
      { id: 'i008b', venda_id: 'vnd-008', produto_id: 'p009', produto_nome: 'Tênis Casual Branco',
        produto_sku: 'CAL-001-BR', produto_imagem_url: 'https://picsum.photos/seed/prod9/200/200',
        quantidade: 1, preco_unitario: 289.9, desconto_item: 0, subtotal: 289.9 },
      { id: 'i008c', venda_id: 'vnd-008', produto_id: 'p012', produto_nome: 'Bolsa Clutch de Couro',
        produto_sku: 'BOL-002-PT', produto_imagem_url: 'https://picsum.photos/seed/prod12/200/200',
        quantidade: 1, preco_unitario: 239.9, desconto_item: 0, subtotal: 239.9 },
    ],
    subtotal: 709.5, desconto_geral: 50, total: 659.5,
    forma_pagamento: 'cartao_credito', parcelas: 4, status: 'em_separacao',
    timeline: [
      { status: 'orcamento',    criado_em: '27/03/2026 08:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada',   criado_em: '27/03/2026 09:00', usuario: 'Vitor Nishida' },
      { status: 'em_separacao', criado_em: '28/03/2026 09:22', usuario: 'Vitor Nishida' },
    ],
    observacoes: 'Cliente aguarda entrega expressa.', vendedor: 'Vitor Nishida',
    criado_em: '27/03/2026 08:00', atualizado_em: '28/03/2026 09:22',
  },

  // VND-009 — Lucas Ferreira — Óculos de Sol — confirmada
  {
    id: 'vnd-009', numero: 'VND-009',
    cliente_id: 'c004', cliente_nome: 'Lucas Ferreira', cliente_telefone: '(41) 96543-2109',
    itens: [
      { id: 'i009a', venda_id: 'vnd-009', produto_id: 'p007', produto_nome: 'Óculos de Sol Retrô',
        produto_sku: 'ACE-002-PR', produto_imagem_url: 'https://picsum.photos/seed/prod7/200/200',
        quantidade: 1, preco_unitario: 249.9, desconto_item: 0, subtotal: 249.9 },
    ],
    subtotal: 249.9, desconto_geral: 0, total: 249.9,
    forma_pagamento: 'pix', parcelas: null, status: 'confirmada',
    timeline: [
      { status: 'orcamento',  criado_em: '27/03/2026 14:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada', criado_em: '27/03/2026 15:00', usuario: 'Vitor Nishida' },
    ],
    observacoes: null, vendedor: 'Vitor Nishida',
    criado_em: '27/03/2026 14:00', atualizado_em: '27/03/2026 15:00',
  },

  // VND-010 — Beatriz Costa — Camiseta Estampada — confirmada
  {
    id: 'vnd-010', numero: 'VND-010',
    cliente_id: 'c003', cliente_nome: 'Beatriz Costa', cliente_telefone: '(31) 97654-3210',
    itens: [
      { id: 'i010a', venda_id: 'vnd-010', produto_id: 'p002', produto_nome: 'Camiseta Estampada Urban',
        produto_sku: 'CAM-002-PR', produto_imagem_url: 'https://picsum.photos/seed/prod2/200/200',
        quantidade: 4, preco_unitario: 79.9, desconto_item: 0, subtotal: 319.6 },
    ],
    subtotal: 319.6, desconto_geral: 0, total: 319.6,
    forma_pagamento: 'cartao_debito', parcelas: null, status: 'confirmada',
    timeline: [
      { status: 'orcamento',  criado_em: '28/03/2026 10:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada', criado_em: '28/03/2026 12:05', usuario: 'Vitor Nishida' },
    ],
    observacoes: null, vendedor: 'Vitor Nishida',
    criado_em: '28/03/2026 10:00', atualizado_em: '28/03/2026 12:05',
  },

  // VND-011 — Carlos Mendes — Camiseta Básica + Calça Jeans — entregue
  {
    id: 'vnd-011', numero: 'VND-011',
    cliente_id: 'c002', cliente_nome: 'Carlos Mendes', cliente_telefone: '(21) 98765-4321',
    itens: [
      { id: 'i011a', venda_id: 'vnd-011', produto_id: 'p001', produto_nome: 'Camiseta Básica Branca',
        produto_sku: 'CAM-001-BR', produto_imagem_url: 'https://picsum.photos/seed/prod1/200/200',
        quantidade: 2, preco_unitario: 59.9, desconto_item: 0, subtotal: 119.8 },
      { id: 'i011b', venda_id: 'vnd-011', produto_id: 'p004', produto_nome: 'Calça Jeans Slim Masculina',
        produto_sku: 'CAL-001-AZ', produto_imagem_url: 'https://picsum.photos/seed/prod4/200/200',
        quantidade: 2, preco_unitario: 199.9, desconto_item: 0, subtotal: 399.8 },
    ],
    subtotal: 519.6, desconto_geral: 0, total: 519.6,
    forma_pagamento: 'pix', parcelas: null, status: 'entregue',
    timeline: [
      { status: 'orcamento',    criado_em: '25/03/2026 09:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada',   criado_em: '25/03/2026 09:30', usuario: 'Vitor Nishida' },
      { status: 'em_separacao', criado_em: '27/03/2026 08:00', usuario: 'Vitor Nishida' },
      { status: 'entregue',     criado_em: '28/03/2026 13:10', usuario: 'Vitor Nishida' },
    ],
    observacoes: null, vendedor: 'Vitor Nishida',
    criado_em: '25/03/2026 09:00', atualizado_em: '28/03/2026 13:10',
  },

  // VND-012 — Rafael Oliveira — Tênis — orcamento
  {
    id: 'vnd-012', numero: 'VND-012',
    cliente_id: 'c006', cliente_nome: 'Rafael Oliveira', cliente_telefone: '(71) 94321-0987',
    itens: [
      { id: 'i012a', venda_id: 'vnd-012', produto_id: 'p009', produto_nome: 'Tênis Casual Branco',
        produto_sku: 'CAL-001-BR', produto_imagem_url: 'https://picsum.photos/seed/prod9/200/200',
        quantidade: 2, preco_unitario: 289.9, desconto_item: 0, subtotal: 579.8 },
    ],
    subtotal: 579.8, desconto_geral: 30, total: 549.8,
    forma_pagamento: 'crediario', parcelas: 5, status: 'orcamento',
    timeline: [
      { status: 'orcamento', criado_em: '28/03/2026 11:00', usuario: 'Vitor Nishida' },
    ],
    observacoes: 'Aguardando aprovação de crediário.', vendedor: 'Vitor Nishida',
    criado_em: '28/03/2026 11:00', atualizado_em: '28/03/2026 11:00',
  },

  // VND-013 — Juliana Martins — Bolsa Clutch de Couro — entregue
  {
    id: 'vnd-013', numero: 'VND-013',
    cliente_id: 'c009', cliente_nome: 'Juliana Martins', cliente_telefone: '(92) 91098-7654',
    itens: [
      { id: 'i013a', venda_id: 'vnd-013', produto_id: 'p012', produto_nome: 'Bolsa Clutch de Couro',
        produto_sku: 'BOL-002-PT', produto_imagem_url: 'https://picsum.photos/seed/prod12/200/200',
        quantidade: 3, preco_unitario: 239.9, desconto_item: 0, subtotal: 719.7 },
    ],
    subtotal: 719.7, desconto_geral: 0, total: 719.7,
    forma_pagamento: 'cartao_credito', parcelas: 2, status: 'entregue',
    timeline: [
      { status: 'orcamento',    criado_em: '22/03/2026 10:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada',   criado_em: '22/03/2026 10:30', usuario: 'Vitor Nishida' },
      { status: 'em_separacao', criado_em: '23/03/2026 09:00', usuario: 'Vitor Nishida' },
      { status: 'entregue',     criado_em: '25/03/2026 12:00', usuario: 'Vitor Nishida' },
    ],
    observacoes: null, vendedor: 'Vitor Nishida',
    criado_em: '22/03/2026 10:00', atualizado_em: '25/03/2026 12:00',
  },

  // VND-014 — Avulso — Sandália Rasteira + Camiseta Básica — orcamento
  {
    id: 'vnd-014', numero: 'VND-014',
    cliente_id: null, cliente_nome: 'Cliente Avulso', cliente_telefone: null,
    itens: [
      { id: 'i014a', venda_id: 'vnd-014', produto_id: 'p010', produto_nome: 'Sandália Rasteira Feminina',
        produto_sku: 'CAL-002-BE', produto_imagem_url: 'https://picsum.photos/seed/prod10/200/200',
        quantidade: 2, preco_unitario: 79.9, desconto_item: 0, subtotal: 159.8 },
      { id: 'i014b', venda_id: 'vnd-014', produto_id: 'p001', produto_nome: 'Camiseta Básica Branca',
        produto_sku: 'CAM-001-BR', produto_imagem_url: 'https://picsum.photos/seed/prod1/200/200',
        quantidade: 1, preco_unitario: 59.9, desconto_item: 0, subtotal: 59.9 },
    ],
    subtotal: 219.7, desconto_geral: 0, total: 219.7,
    forma_pagamento: 'dinheiro', parcelas: null, status: 'orcamento',
    timeline: [
      { status: 'orcamento', criado_em: '28/03/2026 13:45', usuario: 'Vitor Nishida' },
    ],
    observacoes: null, vendedor: 'Vitor Nishida',
    criado_em: '28/03/2026 13:45', atualizado_em: '28/03/2026 13:45',
  },

  // VND-015 — Ana Lima — Óculos de Sol + Sandália — em_separacao
  {
    id: 'vnd-015', numero: 'VND-015',
    cliente_id: 'c001', cliente_nome: 'Ana Lima', cliente_telefone: '(11) 99234-5678',
    itens: [
      { id: 'i015a', venda_id: 'vnd-015', produto_id: 'p010', produto_nome: 'Sandália Rasteira Feminina',
        produto_sku: 'CAL-002-BE', produto_imagem_url: 'https://picsum.photos/seed/prod10/200/200',
        quantidade: 3, preco_unitario: 79.9, desconto_item: 0, subtotal: 239.7 },
    ],
    subtotal: 239.7, desconto_geral: 0, total: 239.7,
    forma_pagamento: 'pix', parcelas: null, status: 'em_separacao',
    timeline: [
      { status: 'orcamento',    criado_em: '28/03/2026 14:00', usuario: 'Vitor Nishida' },
      { status: 'confirmada',   criado_em: '28/03/2026 14:30', usuario: 'Vitor Nishida' },
      { status: 'em_separacao', criado_em: '28/03/2026 15:00', usuario: 'Vitor Nishida' },
    ],
    observacoes: null, vendedor: 'Vitor Nishida',
    criado_em: '28/03/2026 14:00', atualizado_em: '28/03/2026 15:00',
  },
]
