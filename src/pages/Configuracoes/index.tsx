import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MenuConfiguracoes, MENU_GRUPOS, type ConfiguracaoId } from '@/components/configuracoes/MenuConfiguracoes'
import { MeuPerfil } from '@/components/configuracoes/abas/MeuPerfil'
import { DadosEmpresa } from '@/components/configuracoes/abas/DadosEmpresa'
import { Usuarios } from '@/components/configuracoes/abas/Usuarios'
import { PlanoCobranca } from '@/components/configuracoes/abas/PlanoCobranca'
import { SobreApp } from '@/components/configuracoes/abas/SobreApp'

const ABA_COMPONENTS: Record<ConfiguracaoId, React.ComponentType> = {
  perfil: MeuPerfil,
  empresa: DadosEmpresa,
  usuarios: Usuarios,
  plano: PlanoCobranca,
  sobre: SobreApp,
}

export function Configuracoes() {
  const [ativo, setAtivo] = useState<ConfiguracaoId>('perfil')
  const ActiveComponent = ABA_COMPONENTS[ativo]

  return (
    <div className="flex gap-0 min-h-[calc(100vh-4rem)] -mx-4 sm:-mx-6">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] flex-shrink-0 bg-white/[0.02] border-r border-white/5">
        <MenuConfiguracoes ativo={ativo} onChange={setAtivo} />
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 py-5 overflow-y-auto">
        {/* Mobile select */}
        <div className="md:hidden mb-5">
          <label className="text-xs text-white/40 block mb-1.5">Configurações</label>
          <select
            value={ativo}
            onChange={(e) => setAtivo(e.target.value as ConfiguracaoId)}
            className="w-full bg-[#1C1C26] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500/50 appearance-none"
          >
            {MENU_GRUPOS.map((grupo) => (
              <optgroup key={grupo.grupo} label={grupo.grupo}>
                {grupo.items.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={ativo}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
