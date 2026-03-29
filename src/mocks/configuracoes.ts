import type { UsuarioLogado, Empresa, UsuarioEmpresa, PlanoAtual, Pagamento, RecursoPlano } from '@/types/configuracoes'

export const usuarioLogadoMock: UsuarioLogado = {
  id: 'user-001',
  nome: 'João Silva',
  email: 'joao@lojaaurora.com.br',
  cargo: 'Administrador',
  telefone: '(47) 99999-0001',
  avatar_url: null,
  criado_em: '15/08/2025',
}

export const empresaMock: Empresa = {
  id: 'emp-001',
  nome: 'Loja Aurora',
  cnpj: '12.345.678/0001-90',
  telefone: '(47) 3333-0001',
  email: 'contato@lojaaurora.com.br',
  endereco: 'Rua das Flores, 123',
  cidade: 'Blumenau',
  estado: 'SC',
  cep: '89010-000',
  logo_url: null,
}

export const usuariosMock: UsuarioEmpresa[] = [
  {
    id: 'user-001',
    nome: 'João Silva',
    email: 'joao@lojaaurora.com.br',
    cargo: 'Administrador',
    status: 'ativo',
    ultimo_acesso: '29/03/2026 09:15',
    criado_em: '15/08/2025',
  },
  {
    id: 'user-002',
    nome: 'Maria Santos',
    email: 'maria@lojaaurora.com.br',
    cargo: 'Vendedor',
    status: 'ativo',
    ultimo_acesso: '28/03/2026 14:30',
    criado_em: '20/09/2025',
  },
  {
    id: 'user-003',
    nome: 'Carlos Lima',
    email: 'carlos@lojaaurora.com.br',
    cargo: 'Estoquista',
    status: 'ativo',
    ultimo_acesso: '27/03/2026 11:00',
    criado_em: '05/10/2025',
  },
  {
    id: 'user-004',
    nome: 'Ana Souza',
    email: 'ana@lojaaurora.com.br',
    cargo: 'Vendedor',
    status: 'inativo',
    ultimo_acesso: '10/01/2026 08:45',
    criado_em: '12/11/2025',
  },
]

export const planoAtualMock: PlanoAtual = {
  nome: 'Profissional',
  descricao: 'Para lojas em crescimento',
  preco_mensal: 300,
  status: 'ativo',
  proxima_cobranca: '28/04/2026',
  inicio_contrato: '01/10/2025',
  limite_usuarios: 10,
  usuarios_ativos: 4,
  integracoes: ['whatsapp', 'email', 'pagamentos'],
}

export const historicoMock: Pagamento[] = [
  { id: 'p-006', fatura: 'FAT-2026-006', periodo: 'Março 2026', valor: 300, status: 'pago', data: '01/03/2026' },
  { id: 'p-005', fatura: 'FAT-2026-005', periodo: 'Fevereiro 2026', valor: 300, status: 'pago', data: '01/02/2026' },
  { id: 'p-004', fatura: 'FAT-2026-004', periodo: 'Janeiro 2026', valor: 300, status: 'pago', data: '01/01/2026' },
  { id: 'p-003', fatura: 'FAT-2025-003', periodo: 'Dezembro 2025', valor: 300, status: 'pago', data: '01/12/2025' },
  { id: 'p-002', fatura: 'FAT-2025-002', periodo: 'Novembro 2025', valor: 300, status: 'pago', data: '01/11/2025' },
  { id: 'p-001', fatura: 'FAT-2025-001', periodo: 'Outubro 2025', valor: 300, status: 'pago', data: '01/10/2025' },
]

export const recursosPorPlanoMock: RecursoPlano[] = [
  {
    plano: 'Básico',
    preco: 150,
    recursos: ['Dashboard', 'Produtos', 'Vendas', 'Clientes básico', 'E-mail'],
  },
  {
    plano: 'Profissional',
    preco: 300,
    recursos: ['Tudo do Básico', 'Relatórios completos', 'WhatsApp', 'Pagamentos', 'Multi-usuário', 'Exportação PDF/Excel'],
  },
  {
    plano: 'Avançado',
    preco: 500,
    recursos: ['Tudo do Profissional', 'ERP (Bling)', 'Logística', 'CRM', 'API personalizada', 'Suporte prioritário'],
  },
]
