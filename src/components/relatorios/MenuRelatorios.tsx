import { motion } from 'framer-motion'
import {
  BarChart2,
  TrendingUp,
  CreditCard,
  User,
  Package,
  Layers,
  AlertTriangle,
  RefreshCw,
  Users,
  Trophy,
} from 'lucide-react'

export type RelatorioId =
  | 'faturamento_periodo'
  | 'vendas_pagamento'
  | 'vendas_cliente'
  | 'produtos_vendidos'
  | 'posicao_estoque'
  | 'abaixo_minimo'
  | 'movimentacoes'
  | 'clientes_status'
  | 'ranking_clientes'

interface MenuItem {
  id: RelatorioId
  label: string
  icon: React.ElementType
}

interface MenuGroup {
  grupo: string
  items: MenuItem[]
}

export const MENU_GRUPOS: MenuGroup[] = [
  {
    grupo: 'VENDAS',
    items: [
      { id: 'faturamento_periodo', label: 'Faturamento por Período', icon: TrendingUp },
      { id: 'vendas_pagamento', label: 'Vendas por Forma de Pagamento', icon: CreditCard },
      { id: 'vendas_cliente', label: 'Vendas por Cliente', icon: User },
      { id: 'produtos_vendidos', label: 'Produtos Mais Vendidos', icon: Package },
    ],
  },
  {
    grupo: 'ESTOQUE',
    items: [
      { id: 'posicao_estoque', label: 'Posição Atual do Estoque', icon: Layers },
      { id: 'abaixo_minimo', label: 'Produtos Abaixo do Mínimo', icon: AlertTriangle },
      { id: 'movimentacoes', label: 'Movimentações por Período', icon: RefreshCw },
    ],
  },
  {
    grupo: 'CLIENTES',
    items: [
      { id: 'clientes_status', label: 'Clientes por Status', icon: Users },
      { id: 'ranking_clientes', label: 'Ranking de Clientes', icon: Trophy },
    ],
  },
]

interface Props {
  ativo: RelatorioId
  onChange: (id: RelatorioId) => void
}

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
}
const itemVariant = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

export function MenuRelatorios({ ativo, onChange }: Props) {
  return (
    <div className="h-full flex flex-col">
      {/* Título */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/5">
        <BarChart2 size={20} className="text-indigo-400" />
        <span className="text-base font-bold text-white">Relatórios</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-1">
          {MENU_GRUPOS.map((grupo, gi) => (
            <div key={grupo.grupo}>
              {/* Separador + label do grupo */}
              {gi > 0 && <div className="border-t border-white/5 my-3" />}
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-1">
                {grupo.grupo}
              </p>

              {grupo.items.map((item) => {
                const Icon = item.icon
                const isAtivo = ativo === item.id
                return (
                  <motion.button
                    key={item.id}
                    variants={itemVariant}
                    onClick={() => onChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left relative ${
                      isAtivo
                        ? 'bg-indigo-500/20 text-white border-l-2 border-indigo-400'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <Icon size={15} className={isAtivo ? 'text-indigo-400' : 'text-white/40'} />
                    <span className="leading-tight">{item.label}</span>
                  </motion.button>
                )
              })}
            </div>
          ))}
        </motion.div>
      </nav>
    </div>
  )
}
