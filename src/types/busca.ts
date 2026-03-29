export type TipoBusca = 'cliente' | 'produto' | 'venda' | 'movimentacao'

export interface ResultadoBusca {
  id: string
  tipo: TipoBusca
  icone_cor: string
  titulo: string
  subtitulo: string
  rota: string
  badge_texto: string
  badge_cor: string
  thumbnail?: string
}
