import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Shield, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { usuarioLogadoMock } from '@/mocks/configuracoes'
import type { Cargo } from '@/types/configuracoes'

const CARGOS: Cargo[] = ['Administrador', 'Gerente', 'Vendedor', 'Estoquista', 'Financeiro']

function calcularForca(senha: string): { nivel: 0 | 1 | 2 | 3; label: string; cor: string } {
  if (!senha.length) return { nivel: 0, label: '', cor: '' }
  let pts = 0
  if (senha.length >= 8) pts++
  if (/[A-Z]/.test(senha)) pts++
  if (/[0-9]/.test(senha)) pts++
  if (/[^A-Za-z0-9]/.test(senha)) pts++
  if (pts <= 1) return { nivel: 1, label: 'Fraca', cor: 'bg-red-500' }
  if (pts <= 2) return { nivel: 2, label: 'Média', cor: 'bg-yellow-500' }
  return { nivel: 3, label: 'Forte', cor: 'bg-emerald-500' }
}

const inputCls =
  'w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-400/20 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none transition-all'
const labelCls = 'block text-xs font-medium text-white/40 mb-1.5'

export function MeuPerfil() {
  const { showToast } = useToast()
  const [usuario, setUsuario] = useState(usuarioLogadoMock)
  const [form, setForm] = useState({
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
    cargo: usuario.cargo as Cargo,
  })
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [show, setShow] = useState({ atual: false, nova: false, confirmar: false })
  const [showModalSessoes, setShowModalSessoes] = useState(false)

  const forca = calcularForca(novaSenha)
  const coincidem = novaSenha.length > 0 && novaSenha === confirmar
  const podeAlterar = senhaAtual.length > 0 && forca.nivel >= 2 && coincidem

  function salvarPerfil() {
    setUsuario((u) => ({ ...u, ...form }))
    showToast('Perfil atualizado com sucesso', 'success')
  }

  function cancelarPerfil() {
    setForm({ nome: usuario.nome, email: usuario.email, telefone: usuario.telefone, cargo: usuario.cargo })
  }

  function alterarSenha() {
    if (!podeAlterar) return
    setSenhaAtual('')
    setNovaSenha('')
    setConfirmar('')
    showToast('Senha alterada com sucesso', 'success')
  }

  function encerrarSessoes() {
    setShowModalSessoes(false)
    showToast('Todas as sessões foram encerradas', 'success')
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center gap-2 mb-1">
          <User size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Meu Perfil</h2>
        </div>
        <p className="text-sm text-white/40">Gerencie suas informações pessoais e de acesso</p>
      </motion.div>

      {/* Informações pessoais */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
      >
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
            <span className="text-3xl font-black text-white">{usuario.nome.charAt(0)}</span>
          </div>
          <div>
            <p className="text-xl font-bold text-white">{usuario.nome}</p>
            <span className="inline-flex px-2 py-0.5 text-xs rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mt-1">
              {usuario.cargo}
            </span>
            <p className="text-xs text-white/30 mt-1.5">Membro desde {usuario.criado_em}</p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-white/70 mb-4">Informações Pessoais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nome completo</label>
            <input className={inputCls} value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>E-mail</label>
            <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Telefone</label>
            <input className={inputCls} value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Cargo</label>
            <select
              className={inputCls + ' bg-[#1C1C26] appearance-none'}
              value={form.cargo}
              onChange={(e) => setForm((f) => ({ ...f, cargo: e.target.value as Cargo }))}
            >
              {CARGOS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={salvarPerfil}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Salvar Alterações
          </motion.button>
          <button onClick={cancelarPerfil} className="px-4 py-2 text-sm text-white/40 hover:text-white/70 transition-colors">
            Cancelar
          </button>
        </div>
      </motion.div>

      {/* Segurança */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-5">
          <Shield size={16} className="text-white/40" />
          <h3 className="text-sm font-semibold text-white/70">Segurança</h3>
        </div>

        <div className="space-y-4">
          {/* Senha atual */}
          <div>
            <label className={labelCls}>Senha atual</label>
            <div className="relative">
              <input
                type={show.atual ? 'text' : 'password'}
                className={inputCls + ' pr-10'}
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, atual: !s.atual }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {show.atual ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Nova senha */}
          <div>
            <label className={labelCls}>Nova senha</label>
            <div className="relative">
              <input
                type={show.nova ? 'text' : 'password'}
                className={inputCls + ' pr-10'}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, nova: !s.nova }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {show.nova ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {novaSenha.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {([1, 2, 3] as const).map((n) => (
                    <div
                      key={n}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${forca.nivel >= n ? forca.cor : 'bg-white/10'}`}
                    />
                  ))}
                </div>
                <p className={`text-[10px] font-medium ${
                  forca.nivel === 1 ? 'text-red-400' : forca.nivel === 2 ? 'text-yellow-400' : 'text-emerald-400'
                }`}>{forca.label}</p>
              </div>
            )}
          </div>

          {/* Confirmar senha */}
          <div>
            <label className={labelCls}>Confirmar nova senha</label>
            <div className="relative">
              <input
                type={show.confirmar ? 'text' : 'password'}
                className={inputCls + ' pr-10'}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, confirmar: !s.confirmar }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {show.confirmar ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {confirmar.length > 0 && (
              <p className={`text-[10px] mt-1 font-medium ${coincidem ? 'text-emerald-400' : 'text-red-400'}`}>
                {coincidem ? 'Senhas coincidem' : 'Senhas não coincidem'}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <motion.button
            whileHover={podeAlterar ? { scale: 1.02 } : {}}
            whileTap={podeAlterar ? { scale: 0.97 } : {}}
            onClick={alterarSenha}
            disabled={!podeAlterar}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            Alterar Senha
          </motion.button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <p className="text-xs text-white/30">Último acesso: 29/03/2026 09:15</p>
            <button
              onClick={() => setShowModalSessoes(true)}
              className="text-xs text-red-400/70 hover:text-red-400 transition-colors text-left sm:text-right"
            >
              Encerrar todas as sessões
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal sessões */}
      {showModalSessoes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModalSessoes(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#1C1C2E] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
          >
            <h3 className="text-base font-bold text-white mb-2">Encerrar sessões</h3>
            <p className="text-sm text-white/50 mb-5">Você será desconectado de todos os dispositivos. Confirma?</p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={encerrarSessoes}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Encerrar
              </motion.button>
              <button
                onClick={() => setShowModalSessoes(false)}
                className="flex-1 py-2.5 border border-white/10 text-white/60 hover:text-white text-sm rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
