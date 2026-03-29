import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import type { MovimentacaoEstoque } from '@/types/produto'

export type TipoManual = Exclude<MovimentacaoEstoque['tipo'], 'venda'>

const tipoOptions: {
  value: TipoManual
  label: string
  operacao: 'entrada' | 'saida'
  placeholder: string
}[] = [
  {
    value: 'ajuste_positivo',
    label: 'Ajuste Positivo',
    operacao: 'entrada',
    placeholder: 'Ex: Diferença encontrada no inventário físico',
  },
  {
    value: 'ajuste_negativo',
    label: 'Ajuste Negativo',
    operacao: 'saida',
    placeholder: 'Ex: Diferença encontrada no inventário físico',
  },
  {
    value: 'devolucao_cliente',
    label: 'Devolução de Cliente',
    operacao: 'entrada',
    placeholder: 'Ex: Cliente devolveu produto com defeito',
  },
  {
    value: 'perda',
    label: 'Perda',
    operacao: 'saida',
    placeholder: 'Ex: Produto danificado durante transporte',
  },
  {
    value: 'compra',
    label: 'Compra Manual',
    operacao: 'entrada',
    placeholder: 'Ex: Compra emergencial fornecedor local',
  },
]

interface ModalMovimentacaoProps {
  open: boolean
  onClose: () => void
  onConfirm: (tipo: TipoManual, quantidade: number, motivo: string) => void
  estoqueAtual: number
  estoqueMinimo: number
  nomeProduto: string
}

export function ModalMovimentacao({
  open,
  onClose,
  onConfirm,
  estoqueAtual,
  estoqueMinimo,
  nomeProduto,
}: ModalMovimentacaoProps) {
  const [tipo, setTipo] = useState<TipoManual>('ajuste_positivo')
  const [quantidade, setQuantidade] = useState(1)
  const [motivo, setMotivo] = useState('')

  const opcaoAtual = tipoOptions.find((o) => o.value === tipo)!
  const delta = opcaoAtual.operacao === 'entrada' ? quantidade : -quantidade
  const estoqueDepois = estoqueAtual + delta

  const erroNegativo = estoqueDepois < 0
  const avisoMinimo = !erroNegativo && estoqueDepois < estoqueMinimo && opcaoAtual.operacao === 'saida'
  const podeSalvar = motivo.trim().length >= 10 && !erroNegativo

  function handleConfirm() {
    if (!podeSalvar) return
    onConfirm(tipo, quantidade, motivo.trim())
    reset()
    onClose()
  }

  function reset() {
    setTipo('ajuste_positivo')
    setQuantidade(1)
    setMotivo('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && handleClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#1C1C26] border border-[#2A2A3A] rounded-2xl p-6 shadow-2xl focus:outline-none"
              >
                <Dialog.Title className="text-base font-semibold text-white mb-0.5">
                  Registrar Movimentação
                </Dialog.Title>
                <Dialog.Description className="text-xs text-white/40 mb-5 truncate">
                  {nomeProduto}
                </Dialog.Description>

                <div className="space-y-4">
                  {/* Tipo */}
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5" htmlFor="tipo-mov">
                      Tipo de movimentação <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="tipo-mov"
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as TipoManual)}
                      className="w-full bg-white/10 border border-indigo-500/50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 rounded-lg px-3 py-2 text-sm text-white outline-none transition-all"
                    >
                      {tipoOptions.map((o) => (
                        <option key={o.value} value={o.value} className="bg-[#1C1C26]">
                          {o.label} ({o.operacao === 'entrada' ? '↑ Entrada' : '↓ Saída'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantidade */}
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5" htmlFor="qtd-mov">
                      Quantidade <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="qtd-mov"
                      type="number"
                      min={1}
                      value={quantidade}
                      onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white/10 border border-indigo-500/50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 rounded-lg px-3 py-2 text-sm text-white outline-none transition-all"
                    />
                  </div>

                  {/* Motivo */}
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5" htmlFor="motivo-mov">
                      Motivo <span className="text-red-400">*</span>
                      <span className="text-white/20 ml-1">(mín. 10 caracteres)</span>
                    </label>
                    <textarea
                      id="motivo-mov"
                      rows={2}
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder={opcaoAtual.placeholder}
                      className="w-full bg-white/10 border border-indigo-500/50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Preview */}
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <div className="text-center shrink-0">
                      <p className="text-[10px] text-white/30 mb-0.5">Atual</p>
                      <p className="text-xl font-bold text-white">{estoqueAtual}</p>
                    </div>
                    <ArrowRight size={16} className="text-white/20 shrink-0" />
                    <div className="text-center shrink-0">
                      <p className="text-[10px] text-white/30 mb-0.5">Após</p>
                      <p
                        className={`text-xl font-bold ${
                          erroNegativo
                            ? 'text-red-400'
                            : opcaoAtual.operacao === 'entrada'
                            ? 'text-emerald-400'
                            : 'text-orange-400'
                        }`}
                      >
                        {estoqueDepois}
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <span
                        className={`text-sm font-semibold ${
                          opcaoAtual.operacao === 'entrada' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {opcaoAtual.operacao === 'entrada' ? '+' : '−'}{quantidade}
                      </span>
                      <p className="text-[10px] text-white/30">unidades</p>
                    </div>
                  </div>

                  {/* Warnings */}
                  <AnimatePresence>
                    {erroNegativo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"
                      >
                        <AlertTriangle size={13} className="text-red-400 shrink-0" />
                        <p className="text-xs text-red-300">Quantidade maior que o estoque disponível.</p>
                      </motion.div>
                    )}
                    {avisoMinimo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2"
                      >
                        <AlertTriangle size={13} className="text-yellow-400 shrink-0" />
                        <p className="text-xs text-yellow-300">
                          Estoque resultante ({estoqueDepois}) ficará abaixo do mínimo ({estoqueMinimo}).
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white/80 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!podeSalvar}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
                  >
                    Registrar
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
