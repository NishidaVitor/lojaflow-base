export type Cargo = 'Administrador' | 'Gerente' | 'Vendedor' | 'Estoquista' | 'Financeiro'
export type StatusUsuario = 'ativo' | 'inativo'

export interface UsuarioLogado {
  id: string
  nome: string
  email: string
  cargo: Cargo
  telefone: string
  avatar_url: string | null
  criado_em: string
}

export interface Empresa {
  id: string
  nome: string
  cnpj: string
  telefone: string
  email: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  logo_url: string | null
}

export interface UsuarioEmpresa {
  id: string
  nome: string
  email: string
  cargo: Cargo
  status: StatusUsuario
  ultimo_acesso: string
  criado_em: string
}

export interface PlanoAtual {
  nome: string
  descricao: string
  preco_mensal: number
  status: 'ativo' | 'inativo'
  proxima_cobranca: string
  inicio_contrato: string
  limite_usuarios: number
  usuarios_ativos: number
  integracoes: string[]
}

export interface Pagamento {
  id: string
  fatura: string
  periodo: string
  valor: number
  status: 'pago' | 'pendente' | 'cancelado'
  data: string
}

export interface RecursoPlano {
  plano: string
  preco: number
  recursos: string[]
}
