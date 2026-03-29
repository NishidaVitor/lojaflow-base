import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Pencil, Power, UserPlus } from 'lucide-react'
import { usuariosMock, planoAtualMock, usuarioLogadoMock } from '@/mocks/configuracoes'
import type { UsuarioEmpresa, Cargo } from '@/types/configuracoes'
import { ModalConvidarUsuario } from '../modais/ModalConvidarUsuario'
import { ModalEditarUsuario } from '../modais/ModalEditarUsuario'
import { ModalDesativarUsuario } from '../modais/ModalDesativarUsuario'

const CARGO_COLORS: Record<Cargo, string> = {
  Administrador: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  Gerente: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Vendedor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Estoquista: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Financeiro: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
}

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-violet-600',
  'from-cyan-500 to-indigo-500',
  'from-emerald-500 to-cyan-500',
  'from-violet-500 to-pink-500',
]

function formatRelative(data: string): string {
  const [d, t = '00:00'] = data.split(' ')
  const [day, mon, yr] = d.split('/')
  const date = new Date(`${yr}-${mon}-${day}T${t}`)
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 30) return `há ${diffDays} dias`
  if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} meses`
  return `há ${Math.floor(diffDays / 365)} ano(s)`
}

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioEmpresa[]>(usuariosMock)
  const [showConvidar, setShowConvidar] = useState(false)
  const [editando, setEditando] = useState<UsuarioEmpresa | null>(null)
  const [desativando, setDesativando] = useState<UsuarioEmpresa | null>(null)

  const ativos = usuarios.filter((u) => u.status === 'ativo').length
  const limite = planoAtualMock.limite_usuarios
  const pct = (ativos / limite) * 100
  const barColor = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-emerald-500'

  function handleEditarSalvar(atualizado: UsuarioEmpresa) {
    setUsuarios((us) => us.map((u) => (u.id === atualizado.id ? atualizado : u)))
  }

  function handleDesativarConfirmar(atualizado: UsuarioEmpresa) {
    setUsuarios((us) => us.map((u) => (u.id === atualizado.id ? atualizado : u)))
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={20} className="text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Usuários</h2>
            </div>
            <p className="text-sm text-white/40">Gerencie quem tem acesso ao sistema</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowConvidar(true)}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
          >
            <UserPlus size={14} />
            Convidar
          </motion.button>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-white/40">{ativos} de {limite} usuários ativos</p>
            <p className="text-xs text-white/30">{pct.toFixed(0)}%</p>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className={`h-full rounded-full ${barColor}`}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-3 px-4 py-3 border-b border-white/8 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
          <span>Usuário</span>
          <span>Cargo</span>
          <span>Status</span>
          <span>Último acesso</span>
          <span>Membro desde</span>
          <span className="text-center">Ações</span>
        </div>

        <AnimatePresence>
          {usuarios.map((usuario, i) => {
            const isLogado = usuario.id === usuarioLogadoMock.id
            const gradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
            return (
              <motion.div
                key={usuario.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-2 md:gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
              >
                {/* Usuário */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                    <span className="text-sm font-bold text-white">{usuario.nome.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate">{usuario.nome}</p>
                    <p className="text-xs text-white/35 truncate">{usuario.email}</p>
                  </div>
                </div>

                {/* Cargo */}
                <div className="flex items-center">
                  <span className={`inline-flex px-2 py-0.5 text-xs rounded-md border ${CARGO_COLORS[usuario.cargo]}`}>
                    {usuario.cargo}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <span className={`inline-flex px-2 py-0.5 text-xs rounded-md border ${
                    usuario.status === 'ativo'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}>
                    {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                {/* Último acesso */}
                <div className="flex items-center">
                  <span className="text-xs text-white/40">{formatRelative(usuario.ultimo_acesso)}</span>
                </div>

                {/* Membro desde */}
                <div className="flex items-center">
                  <span className="text-xs text-white/40">{usuario.criado_em}</span>
                </div>

                {/* Ações */}
                <div className="flex items-center justify-center gap-1">
                  {isLogado ? (
                    <span className="text-xs text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      Você
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditando(usuario)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDesativando(usuario)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          usuario.status === 'ativo'
                            ? 'text-white/30 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                        aria-label={usuario.status === 'ativo' ? 'Desativar' : 'Reativar'}
                      >
                        <Power size={14} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {showConvidar && <ModalConvidarUsuario onClose={() => setShowConvidar(false)} />}
      {editando && (
        <ModalEditarUsuario
          usuario={editando}
          onClose={() => setEditando(null)}
          onSalvar={handleEditarSalvar}
        />
      )}
      {desativando && (
        <ModalDesativarUsuario
          usuario={desativando}
          onClose={() => setDesativando(null)}
          onConfirmar={handleDesativarConfirmar}
        />
      )}
    </div>
  )
}
