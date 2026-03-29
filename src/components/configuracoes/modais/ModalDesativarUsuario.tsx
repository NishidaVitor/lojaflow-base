import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import type { UsuarioEmpresa } from '@/types/configuracoes'

interface Props {
  usuario: UsuarioEmpresa
  onClose: () => void
  onConfirmar: (usuario: UsuarioEmpresa) => void
}

export function ModalDesativarUsuario({ usuario, onClose, onConfirmar }: Props) {
  const { showToast } = useToast()
  const isAtivo = usuario.status === 'ativo'

  function handleConfirmar() {
    const atualizado: UsuarioEmpresa = { ...usuario, status: isAtivo ? 'inativo' : 'ativo' }
    onConfirmar(atualizado)
    showToast(isAtivo ? `${usuario.nome} foi desativado` : `${usuario.nome} foi reativado`, 'success')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#1C1C2E] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-white">
            {isAtivo ? 'Desativar' : 'Reativar'} Usuário
          </h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-white/50 mb-5">
          {isAtivo
            ? `Deseja desativar o acesso de ${usuario.nome}? Ele não poderá mais entrar no sistema.`
            : `Deseja reativar o acesso de ${usuario.nome}?`}
        </p>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleConfirmar}
            className={`flex-1 py-2.5 text-white text-sm font-medium rounded-xl transition-colors ${
              isAtivo ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {isAtivo ? 'Desativar' : 'Reativar'}
          </motion.button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-white/10 text-white/60 hover:text-white text-sm rounded-xl transition-colors"
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    </div>
  )
}
