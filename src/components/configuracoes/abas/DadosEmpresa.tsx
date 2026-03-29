import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Store } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { empresaMock } from '@/mocks/configuracoes'

const inputCls =
  'w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-400/20 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none transition-all'
const labelCls = 'block text-xs font-medium text-white/40 mb-1.5'

export function DadosEmpresa() {
  const { showToast } = useToast()
  const [empresa, setEmpresa] = useState(empresaMock)
  const [form, setForm] = useState({
    nome: empresa.nome,
    cnpj: empresa.cnpj,
    email: empresa.email,
    telefone: empresa.telefone,
    endereco: empresa.endereco,
    cidade: empresa.cidade,
    estado: empresa.estado,
    cep: empresa.cep,
  })

  function salvar() {
    setEmpresa((e) => ({ ...e, ...form }))
    showToast('Dados da empresa atualizados com sucesso', 'success')
  }

  function cancelar() {
    setForm({
      nome: empresa.nome,
      cnpj: empresa.cnpj,
      email: empresa.email,
      telefone: empresa.telefone,
      endereco: empresa.endereco,
      cidade: empresa.cidade,
      estado: empresa.estado,
      cep: empresa.cep,
    })
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Dados da Empresa</h2>
        </div>
        <p className="text-sm text-white/40">Informações do seu estabelecimento</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
      >
        {/* Logo */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/8">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Store size={32} className="text-white/20" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{empresa.nome}</p>
            <p className="text-xs text-white/30 mt-0.5">{empresa.cnpj}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => showToast('Funcionalidade em desenvolvimento', 'info')}
              className="mt-2 px-3 py-1.5 text-xs font-medium text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/10 rounded-lg transition-colors"
            >
              Alterar logo
            </motion.button>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-white/70 mb-4">Identidade da Empresa</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nome da empresa</label>
            <input className={inputCls} value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>CNPJ</label>
            <input className={inputCls} value={form.cnpj} onChange={(e) => setForm((f) => ({ ...f, cnpj: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>E-mail comercial</label>
            <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Telefone comercial</label>
            <input className={inputCls} value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-white/70 mt-5 mb-4">Endereço</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>CEP</label>
            <div className="flex gap-2">
              <input
                className={inputCls}
                value={form.cep}
                onChange={(e) => setForm((f) => ({ ...f, cep: e.target.value }))}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => showToast('Funcionalidade em desenvolvimento', 'info')}
                className="px-3 py-2.5 text-xs font-medium text-white/50 border border-white/10 hover:bg-white/5 rounded-lg transition-colors shrink-0"
              >
                Buscar
              </motion.button>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Endereço</label>
            <input className={inputCls} value={form.endereco} onChange={(e) => setForm((f) => ({ ...f, endereco: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Cidade</label>
            <input className={inputCls} value={form.cidade} onChange={(e) => setForm((f) => ({ ...f, cidade: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Estado</label>
            <input className={inputCls} value={form.estado} onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))} />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={salvar}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Salvar Alterações
          </motion.button>
          <button onClick={cancelar} className="px-4 py-2 text-sm text-white/40 hover:text-white/70 transition-colors">
            Cancelar
          </button>
        </div>
      </motion.div>
    </div>
  )
}
