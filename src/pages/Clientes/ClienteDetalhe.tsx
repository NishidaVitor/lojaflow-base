import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Pencil,
  Save,
  X,
  ToggleLeft,
  ToggleRight,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  DollarSign,
  ShoppingBag,
  Calendar,
  MessageSquare,
} from 'lucide-react'
import type { Cliente } from '@/types/cliente'
import { clientesStore } from '@/store/clientesStore'
import { ClienteBadge } from '@/components/clientes/ClienteBadge'
import { ClienteCard } from '@/components/clientes/ClienteCard'
import { ModalDesativar } from '@/components/clientes/ModalDesativar'
import { useToast } from '@/contexts/ToastContext'

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } },
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

interface InfoRowProps {
  icon: React.ElementType
  label: string
  value: string
  isEditing: boolean
  field: keyof Cliente
  editValues: Partial<Cliente>
  onChange: (field: keyof Cliente, value: string) => void
}

function InfoRow({ icon: Icon, label, value, isEditing, field, editValues, onChange }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-white/40" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/30 font-medium mb-1">{label}</p>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.input
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              type="text"
              value={(editValues[field] as string) ?? value}
              onChange={(e) => onChange(field, e.target.value)}
              className="w-full bg-white/10 border border-indigo-500/50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 rounded-lg px-3 py-1.5 text-sm text-white outline-none transition-all"
              aria-label={label}
            />
          ) : (
            <motion.p
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-sm text-white/80"
            >
              {value || <span className="text-white/25 italic">Não informado</span>}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function ClienteDetalhe() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [cliente, setCliente] = useState<Cliente | undefined>(
    id ? clientesStore.get(id) : undefined
  )
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState<Partial<Cliente>>({})
  const [modalOpen, setModalOpen] = useState(false)

  if (!cliente) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-white/50 text-lg font-medium">Cliente não encontrado</p>
        <button
          onClick={() => navigate('/clientes')}
          className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          ← Voltar para clientes
        </button>
      </div>
    )
  }

  const handleEditChange = (field: keyof Cliente, value: string) => {
    setEditValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const updated: Cliente = { ...cliente, ...editValues }
    clientesStore.set(cliente.id, updated)
    setCliente(updated)
    setIsEditing(false)
    setEditValues({})
    showToast('Dados do cliente atualizados com sucesso.')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditValues({})
  }

  const handleToggleStatus = () => {
    const novoStatus: 'ativo' | 'inativo' = cliente.status === 'ativo' ? 'inativo' : 'ativo'
    const updated: Cliente = { ...cliente, status: novoStatus }
    clientesStore.set(cliente.id, updated)
    setCliente(updated)
    showToast(
      novoStatus === 'inativo'
        ? `${cliente.nome} foi desativado.`
        : `${cliente.nome} foi reativado com sucesso.`
    )
  }

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const editableFields: {
    icon: React.ElementType
    label: string
    field: keyof Cliente
  }[] = [
    { icon: Mail, label: 'E-mail', field: 'email' },
    { icon: Phone, label: 'Telefone', field: 'telefone' },
    { icon: MapPin, label: 'Endereço', field: 'endereco' },
    { icon: MapPin, label: 'Cidade', field: 'cidade' },
    { icon: CalendarDays, label: 'Data de Cadastro', field: 'dataCadastro' },
    { icon: MessageSquare, label: 'Observações', field: 'observacoes' },
  ]

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => navigate('/clientes')}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft size={15} />
          Voltar para Clientes
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-700 text-white">{cliente.nome}</h1>
            <ClienteBadge status={cliente.status} />
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <X size={14} />
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                >
                  <Save size={14} />
                  Salvar
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  {cliente.status === 'ativo' ? (
                    <>
                      <ToggleLeft size={14} />
                      Desativar
                    </>
                  ) : (
                    <>
                      <ToggleRight size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Reativar</span>
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                >
                  <Pencil size={14} />
                  Editar
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* Metric cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <motion.div variants={fadeInUp}>
            <ClienteCard
              title="Total Gasto"
              value={formatCurrency(cliente.totalCompras)}
              icon={DollarSign}
              iconColor="text-accent"
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <ClienteCard
              title="Total de Pedidos"
              value={String(cliente.totalPedidos)}
              icon={ShoppingBag}
              iconColor="text-primary"
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <ClienteCard
              title="Última Compra"
              value={cliente.ultimaCompra}
              icon={Calendar}
              iconColor="text-secondary"
            />
          </motion.div>
        </motion.div>

        {/* Personal data card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25, ease: 'easeOut' }}
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
        >
          <h2 className="text-sm font-semibold text-white mb-1">Dados Pessoais</h2>
          <p className="text-xs text-white/30 mb-4">
            {isEditing ? 'Edite os campos abaixo e clique em Salvar.' : 'Informações de contato e cadastro.'}
          </p>

          <div className="divide-y divide-white/5">
            {editableFields.map(({ icon, label, field }) => (
              <InfoRow
                key={field}
                icon={icon}
                label={label}
                value={String(cliente[field])}
                isEditing={isEditing}
                field={field}
                editValues={editValues}
                onChange={handleEditChange}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <ModalDesativar
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleToggleStatus}
        nomeCliente={cliente.nome}
        statusAtual={cliente.status}
      />
    </>
  )
}
