import type { Categoria } from '@/types/produto'

export const categoriasMock: Categoria[] = [
  {
    id: 'cat001',
    nome: 'Camisetas',
    descricao: 'Camisetas masculinas e femininas, básicas e estampadas',
    ativo: true,
  },
  {
    id: 'cat002',
    nome: 'Calças',
    descricao: 'Calças jeans, sociais, moletom e legging',
    ativo: true,
  },
  {
    id: 'cat003',
    nome: 'Acessórios',
    descricao: 'Cintos, óculos, carteiras e bijuterias',
    ativo: true,
  },
  {
    id: 'cat004',
    nome: 'Calçados',
    descricao: 'Tênis, sandálias, sapatos e botas',
    ativo: true,
  },
  {
    id: 'cat005',
    nome: 'Bolsas',
    descricao: 'Bolsas de couro, lona e sintético',
    ativo: true,
  },
]
