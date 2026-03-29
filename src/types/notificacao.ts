export type TipoNotificacao = 'venda' | 'estoque' | 'cliente' | 'sistema' | 'pagamento' | 'usuario'

export interface Notificacao {
  id: string
  tipo: TipoNotificacao
  titulo: string
  mensagem: string
  lida: boolean
  criado_em: string
  referencia_id: string | null
  referencia_tipo: string | null
  referencia_rota: string | null
  icone_cor: string
}
