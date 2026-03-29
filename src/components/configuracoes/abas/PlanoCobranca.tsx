import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Zap, Check, Star, Receipt, Download, AlertTriangle, MessageCircle } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { planoAtualMock, historicoMock, recursosPorPlanoMock } from '@/mocks/configuracoes'

function diasRestantes(dataStr: string): number {
  const [day, mon, yr] = dataStr.split('/')
  const target = new Date(`${yr}-${mon}-${day}`)
  return Math.max(0, Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
}

const integracoesLabels: Record<string, string> = {
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  pagamentos: 'Pagamentos',
}

export function PlanoCobranca() {
  const { showToast } = useToast()
  const [showModal, setShowModal] = useState<'upgrade' | 'downgrade' | null>(null)
  const dias = diasRestantes(planoAtualMock.proxima_cobranca)

  return (
    <div className="space-y-4 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center gap-2 mb-1">
          <CreditCard size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Plano e Cobrança</h2>
        </div>
        <p className="text-sm text-white/40">Gerencie sua assinatura e pagamentos</p>
      </motion.div>

      {/* Plano atual */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gradient-to-br from-indigo-500/10 to-violet-600/10 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-5"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Plano Atual</span>
            <p className="text-2xl font-bold text-white mt-1">{planoAtualMock.nome}</p>
            <p className="text-sm text-white/50">{planoAtualMock.descricao}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-bold text-white">
              R$ {planoAtualMock.preco_mensal.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-xs text-white/40"> / mês</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] text-white/30 uppercase mb-1">Status</p>
            <span className="inline-flex px-2 py-0.5 text-xs rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Ativo
            </span>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase mb-1">Próxima cobrança</p>
            <p className={`text-xs font-medium flex items-center gap-1 flex-wrap ${dias <= 7 ? 'text-yellow-400' : 'text-white/70'}`}>
              {dias <= 7 && <AlertTriangle size={12} />}
              {planoAtualMock.proxima_cobranca} (em {dias}d)
            </p>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase mb-1">Início</p>
            <p className="text-xs text-white/70">{planoAtualMock.inicio_contrato}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase mb-1">Usuários</p>
            <p className="text-xs text-white/70">{planoAtualMock.usuarios_ativos} de {planoAtualMock.limite_usuarios}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-white/40 mb-2">Integrações ativas</p>
          <div className="flex flex-wrap gap-2">
            {planoAtualMock.integracoes.map((int) => (
              <span
                key={int}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg"
              >
                <Check size={11} />
                {integracoesLabels[int] ?? int}
              </span>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => showToast('Redirecionando para o suporte...', 'info')}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 text-sm font-medium rounded-xl transition-colors"
        >
          <MessageCircle size={16} />
          Falar com Suporte
        </motion.button>
      </motion.div>

      {/* Comparativo */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-white/40" />
          <h3 className="text-sm font-semibold text-white/70">Planos disponíveis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recursosPorPlanoMock.map((plano, i) => {
            const isAtual = plano.plano === planoAtualMock.nome
            const isAvancado = plano.plano === 'Avançado'
            return (
              <motion.div
                key={plano.plano}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.25 + i * 0.07 }}
                className={`relative rounded-xl p-4 border transition-all ${
                  isAtual
                    ? 'bg-indigo-500/10 border-indigo-500/50 scale-[1.02]'
                    : 'bg-white/3 border-white/8'
                }`}
              >
                {isAtual && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-indigo-600 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    SEU PLANO
                  </span>
                )}
                <div className="mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    isAtual ? 'text-indigo-400' : isAvancado ? 'text-violet-400' : 'text-white/40'
                  }`}>{plano.plano}</span>
                  <p className="text-xl font-bold text-white mt-1">
                    R$ {plano.preco}
                    <span className="text-xs text-white/40 font-normal">/mês</span>
                  </p>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {plano.recursos.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-white/60">
                      {isAvancado && (r.includes('ERP') || r.includes('CRM') || r.includes('API')) ? (
                        <Star size={12} className="text-cyan-400 shrink-0 mt-0.5" />
                      ) : (
                        <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {r}
                    </li>
                  ))}
                </ul>

                {isAtual ? (
                  <button disabled className="w-full py-2 text-xs text-white/30 bg-white/5 rounded-lg cursor-not-allowed">
                    Plano atual
                  </button>
                ) : isAvancado ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal('upgrade')}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Fazer Upgrade
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal('downgrade')}
                    className="w-full py-2 border border-red-500/30 text-red-400/70 hover:bg-red-500/10 text-xs font-medium rounded-lg transition-colors"
                  >
                    Fazer Downgrade
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Histórico */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={16} className="text-white/40" />
          <h3 className="text-sm font-semibold text-white/70">Histórico de Pagamentos</h3>
        </div>

        <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_1fr_50px] gap-3 px-3 py-2 text-[10px] font-semibold text-white/25 uppercase tracking-widest border-b border-white/8 mb-1">
          <span>Fatura</span>
          <span>Período</span>
          <span>Valor</span>
          <span>Status</span>
          <span></span>
        </div>

        {historicoMock.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.04 }}
            className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_1fr_1fr_50px] gap-2 md:gap-3 px-3 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors rounded-lg"
          >
            <span className="text-xs text-white/60 font-mono">{p.fatura}</span>
            <span className="text-xs text-white/60">{p.periodo}</span>
            <span className="text-xs text-white/80 font-medium">R$ {p.valor.toFixed(2).replace('.', ',')}</span>
            <span className="inline-flex w-fit px-2 py-0.5 text-xs rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Pago
            </span>
            <div className="flex justify-end">
              <button
                onClick={() => showToast('Funcionalidade em desenvolvimento', 'info')}
                className="p-1.5 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              >
                <Download size={14} />
              </button>
            </div>
          </motion.div>
        ))}

        <p className="text-[10px] text-white/25 mt-3 px-3">
          Todas as cobranças são processadas no dia 1 de cada mês
        </p>
      </motion.div>

      {/* Modal upgrade/downgrade */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#1C1C2E] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
          >
            <h3 className="text-base font-bold text-white mb-2">
              {showModal === 'upgrade' ? 'Fazer Upgrade' : 'Fazer Downgrade'}
            </h3>
            <p className="text-sm text-white/50 mb-5">
              {showModal === 'upgrade'
                ? 'Deseja fazer upgrade para o plano Avançado? Um de nossa equipe entrará em contato.'
                : 'Deseja fazer downgrade para o plano Básico? Alguns recursos serão desativados.'}
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  showToast(showModal === 'upgrade' ? 'Solicitação de upgrade enviada' : 'Solicitação enviada', 'success')
                  setShowModal(null)
                }}
                className={`flex-1 py-2.5 text-white text-sm font-medium rounded-xl transition-colors ${
                  showModal === 'upgrade' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                Confirmar
              </motion.button>
              <button
                onClick={() => setShowModal(null)}
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
