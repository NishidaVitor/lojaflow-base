import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import type { Cargo } from '@/types/configuracoes'

const CARGOS: Cargo[] = ['Administrador', 'Gerente', 'Vendedor', 'Estoquista', 'Financeiro']

interface Props {
  onClose: () => void
}

const inputCls =
  'w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-400/20 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none transition-all'
const labelCls = 'block text-xs font-medium text-white/40 mb-1.5'

export function ModalConvidarUsuario({ onClose }: Props) {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [cargo, setCargo] = useState<Cargo>('Vendedor')

  function handleEnviar() {
    if (!email) return
    showToast(`Convite enviado para ${email}`, 'success')
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
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">Convidar Usuário</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>E-mail</label>
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@empresa.com.br"
            />
          </div>
          <div>
            <label className={labelCls}>Cargo</label>
            <select
              className={inputCls + ' bg-[#1C1C26] appearance-none'}
              value={cargo}
              onChange={(e) => setCargo(e.target.value as Cargo)}
            >
              {CARGOS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleEnviar}
            disabled={!email}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
          >
            Enviar Convite
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
