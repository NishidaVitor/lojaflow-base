import { motion } from 'framer-motion'
import { User, Building2, Users, CreditCard, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ConfiguracaoId = 'perfil' | 'empresa' | 'usuarios' | 'plano' | 'sobre'

interface MenuItem {
  id: ConfiguracaoId
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

interface MenuGrupo {
  grupo: string
  items: MenuItem[]
}

export const MENU_GRUPOS: MenuGrupo[] = [
  {
    grupo: 'Conta',
    items: [
      { id: 'perfil', label: 'Meu Perfil', icon: User },
      { id: 'empresa', label: 'Dados da Empresa', icon: Building2 },
    ],
  },
  {
    grupo: 'Equipe',
    items: [
      { id: 'usuarios', label: 'Usuários', icon: Users },
    ],
  },
  {
    grupo: 'Assinatura',
    items: [
      { id: 'plano', label: 'Plano e Cobrança', icon: CreditCard },
    ],
  },
  {
    grupo: 'Sistema',
    items: [
      { id: 'sobre', label: 'Sobre o App', icon: Smartphone },
    ],
  },
]

interface MenuConfiguracoesProps {
  ativo: ConfiguracaoId
  onChange: (id: ConfiguracaoId) => void
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
}

export function MenuConfiguracoes({ ativo, onChange }: MenuConfiguracoesProps) {
  return (
    <div className="flex flex-col h-full py-4 px-2">
      <div className="px-3 mb-5">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Configurações</p>
      </div>
      <motion.nav
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-0.5"
      >
        {MENU_GRUPOS.map((grupo) => (
          <div key={grupo.grupo} className="mb-2">
            <p className="px-3 mb-1 text-[10px] font-semibold text-white/25 uppercase tracking-widest">
              {grupo.grupo}
            </p>
            {grupo.items.map((item) => {
              const Icon = item.icon
              const isAtivo = item.id === ativo
              return (
                <motion.button
                  key={item.id}
                  variants={itemVariants}
                  onClick={() => onChange(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left border-l-2 pl-[10px] pr-3',
                    isAtivo
                      ? 'bg-indigo-500/20 text-white border-indigo-400'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5 border-transparent'
                  )}
                >
                  <Icon size={16} className={isAtivo ? 'text-indigo-400' : 'text-white/35'} />
                  {item.label}
                </motion.button>
              )
            })}
          </div>
        ))}
      </motion.nav>
    </div>
  )
}
