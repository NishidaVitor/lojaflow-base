import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Pencil,
  Save,
  X,
  Power,
  ArrowLeftRight,
  Tag,
  Hash,
  Barcode,
  Building2,
  Layers,
  Ruler,
  TrendingDown,
  DollarSign,
  MapPin,
  CalendarDays,
  Info,
  ImageOff,
} from 'lucide-react'
import { produtosStore, estoqueStore, movimentacoesStore } from '@/store/produtosStore'
import { categoriasMock } from '@/mocks/categorias'
import type { Produto, EstoqueProduto, MovimentacaoEstoque } from '@/types/produto'
import { ClienteBadge } from '@/components/clientes/ClienteBadge'
import { EstoqueBadge } from '@/components/produtos/EstoqueBadge'
import { EstoqueCards } from '@/components/produtos/EstoqueCards'
import { MovimentacaoTabela } from '@/components/produtos/MovimentacaoTabela'
import { ModalMovimentacao, type TipoManual } from '@/components/produtos/ModalMovimentacao'
import { ModalDesativarProduto } from '@/components/produtos/ModalDesativarProduto'
import { getStatusEstoque, formatCurrency } from '@/utils/estoque'
import { useToast } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'

// ─── Edit state shapes ────────────────────────────────────────────────────────
type EditFields = {
  nome: string
  descricao: string
  marca: string
  preco_custo: string
  preco_venda: string
  preco_promocional: string
  categoria_id: string
  localizacao: string
}

// ─── Info field component ─────────────────────────────────────────────────────
interface InfoFieldProps {
  icon: React.ElementType
  label: string
  display: React.ReactNode
  editKey?: keyof EditFields
  isEditing: boolean
  editValues: EditFields
  onChange: (key: keyof EditFields, value: string) => void
  editable?: boolean
  type?: string
}

function InfoField({
  icon: Icon,
  label,
  display,
  editKey,
  isEditing,
  editValues,
  onChange,
  editable = true,
  type = 'text',
}: InfoFieldProps) {
  const editing = isEditing && editable && editKey

  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} className="text-white/35" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-1">{label}</p>
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.input
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              type={type}
              value={editValues[editKey]}
              onChange={(e) => onChange(editKey, e.target.value)}
              className="w-full bg-white/10 border border-indigo-500/50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 rounded-lg px-2.5 py-1.5 text-sm text-white outline-none transition-all"
              aria-label={label}
            />
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="text-sm text-white/80"
            >
              {display ?? <span className="text-white/20 italic text-xs">Não informado</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Category select in edit mode ─────────────────────────────────────────────
function CategoriaField({
  isEditing,
  editValues,
  onChange,
  display,
}: {
  isEditing: boolean
  editValues: EditFields
  onChange: (key: keyof EditFields, value: string) => void
  display: string
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5">
      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
        <Layers size={13} className="text-white/35" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-1">Categoria</p>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.select
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              value={editValues.categoria_id}
              onChange={(e) => onChange('categoria_id', e.target.value)}
              className="w-full bg-white/10 border border-indigo-500/50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 rounded-lg px-2.5 py-1.5 text-sm text-white outline-none transition-all"
            >
              {categoriasMock.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1C1C26]">{c.nome}</option>
              ))}
            </motion.select>
          ) : (
            <motion.p
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="text-sm text-white/80"
            >
              {display}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function ProdutoDetalhe() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [produto, setProduto] = useState<Produto | undefined>(() =>
    id ? produtosStore.get(id) : undefined
  )
  const [estoque, setEstoque] = useState<EstoqueProduto | undefined>(() =>
    id ? estoqueStore.get(id) : undefined
  )
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>(() =>
    movimentacoesStore.filter((m) => m.produto_id === id)
  )

  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState<EditFields>({} as EditFields)
  const [modalDesativar, setModalDesativar] = useState(false)
  const [modalMovimentacao, setModalMovimentacao] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState<'informacoes' | 'movimentacoes'>('informacoes')

  if (!produto || !estoque) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-white/50 text-lg font-medium">Produto não encontrado</p>
        <button onClick={() => navigate('/produtos')} className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          ← Voltar para produtos
        </button>
      </div>
    )
  }

  const categoria = categoriasMock.find((c) => c.id === produto.categoria_id)
  const status = getStatusEstoque(estoque)

  const margem =
    produto.preco_custo > 0
      ? (((produto.preco_venda - produto.preco_custo) / produto.preco_custo) * 100).toFixed(1)
      : '—'

  // ── Edit handlers ────────────────────────────────────────────────────────
  function startEdit() {
    setEditValues({
      nome: produto!.nome,
      descricao: produto!.descricao,
      marca: produto!.marca,
      preco_custo: String(produto!.preco_custo),
      preco_venda: String(produto!.preco_venda),
      preco_promocional: produto!.preco_promocional != null ? String(produto!.preco_promocional) : '',
      categoria_id: produto!.categoria_id,
      localizacao: estoque!.localizacao,
    })
    setIsEditing(true)
  }

  function handleChange(key: keyof EditFields, value: string) {
    setEditValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    const updated: Produto = {
      ...produto!,
      nome: editValues.nome,
      descricao: editValues.descricao,
      marca: editValues.marca,
      preco_custo: parseFloat(editValues.preco_custo) || produto!.preco_custo,
      preco_venda: parseFloat(editValues.preco_venda) || produto!.preco_venda,
      preco_promocional: editValues.preco_promocional ? parseFloat(editValues.preco_promocional) : null,
      categoria_id: editValues.categoria_id,
    }
    const updatedEstoque: EstoqueProduto = { ...estoque!, localizacao: editValues.localizacao }
    produtosStore.set(produto!.id, updated)
    estoqueStore.set(produto!.id, updatedEstoque)
    setProduto(updated)
    setEstoque(updatedEstoque)
    setIsEditing(false)
    showToast('Produto atualizado com sucesso.')
  }

  function handleCancelEdit() {
    setIsEditing(false)
    setEditValues({} as EditFields)
  }

  // ── Toggle status ────────────────────────────────────────────────────────
  function handleToggleStatus() {
    const updated: Produto = { ...produto!, ativo: !produto!.ativo }
    produtosStore.set(produto!.id, updated)
    setProduto(updated)
    showToast(updated.ativo ? `${updated.nome} foi reativado.` : `${updated.nome} foi desativado.`)
  }

  // ── Movimentação ─────────────────────────────────────────────────────────
  function handleNovaMovimentacao(tipo: TipoManual, quantidade: number, motivo: string) {
    const entradaTipos: MovimentacaoEstoque['tipo'][] = ['compra', 'ajuste_positivo', 'devolucao_cliente']
    const operacao: 'entrada' | 'saida' = entradaTipos.includes(tipo) ? 'entrada' : 'saida'
    const estoqueAntes = estoque!.estoque_atual
    const novoReal =
      operacao === 'entrada'
        ? estoque!.estoque_real + quantidade
        : Math.max(0, estoque!.estoque_real - quantidade)
    const novoAtual = Math.max(0, novoReal - estoque!.estoque_reservado)
    const agora =
      new Date().toLocaleDateString('pt-BR') +
      ' ' +
      new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    const nova: MovimentacaoEstoque = {
      id: `m${Date.now()}`,
      produto_id: produto!.id,
      tipo,
      operacao,
      quantidade,
      estoque_antes: estoqueAntes,
      estoque_depois: novoAtual,
      motivo,
      referencia_id: null,
      referencia_tipo: 'ajuste',
      referencia_numero: null,
      referencia_descricao: 'Ajuste manual',
      cliente_nome: null,
      fornecedor_nome: null,
      usuario: 'Vitor Nishida',
      criado_em: agora,
    }

    movimentacoesStore.push(nova)
    const updatedEstoque: EstoqueProduto = {
      ...estoque!,
      estoque_real: novoReal,
      estoque_atual: novoAtual,
      atualizado_em: agora,
    }
    estoqueStore.set(produto!.id, updatedEstoque)
    setEstoque(updatedEstoque)
    setMovimentacoes((prev) => [nova, ...prev])
    showToast(
      `Movimentação registrada — Estoque atualizado de ${estoqueAntes} para ${novoAtual}`
    )
  }

  // ── Derived values for edit previews ──────────────────────────────────────
  const precoVendaEdit = isEditing ? parseFloat(editValues.preco_venda) || 0 : produto.preco_venda
  const precoCustoEdit = isEditing ? parseFloat(editValues.preco_custo) || 0 : produto.preco_custo
  const margemEdit =
    precoCustoEdit > 0
      ? (((precoVendaEdit - precoCustoEdit) / precoCustoEdit) * 100).toFixed(1)
      : '—'
  const categoriaEdit = isEditing
    ? categoriasMock.find((c) => c.id === editValues.categoria_id)
    : categoria

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ── Back ── */}
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => navigate('/produtos')}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft size={15} />
          Voltar para Produtos
        </motion.button>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
        >
          {/* Left: thumbnail + info */}
          <div className="flex items-start gap-4">
            {produto.imagem_url ? (
              <img
                src={produto.imagem_url}
                alt={produto.nome}
                className="w-16 h-16 rounded-xl object-cover border border-indigo-500/30 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <ImageOff size={22} className="text-white/20" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">{produto.nome}</h1>
              <p className="text-sm text-white/35 font-mono mt-0.5">{produto.sku}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <ClienteBadge status={produto.ativo ? 'ativo' : 'inativo'} />
                <EstoqueBadge status={status} />
                {categoria && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-violet-500/15 text-violet-300 border-violet-500/25">
                    {categoria.nome}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <X size={14} /> Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                >
                  <Save size={14} /> Salvar
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setModalMovimentacao(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10 transition-colors"
                >
                  <ArrowLeftRight size={14} /> Movimentação
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setModalDesativar(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <Power size={14} className={cn(produto.ativo ? 'text-white/50' : 'text-emerald-400')} />
                  <span className={produto.ativo ? 'text-white/60' : 'text-emerald-400'}>
                    {produto.ativo ? 'Desativar' : 'Reativar'}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={startEdit}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                >
                  <Pencil size={14} /> Editar
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* ── Block 2: Estoque Cards ── */}
        <EstoqueCards estoque={estoque} status={status} />

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 border-b border-white/8">
          {(
            [
              { key: 'informacoes', label: 'Informações' },
              { key: 'movimentacoes', label: 'Movimentações', count: movimentacoes.length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setAbaAtiva(tab.key)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
                abaAtiva === tab.key
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
              )}
            >
              {tab.label}
              {'count' in tab && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/25 font-medium">
                  {tab.count}
                </span>
              )}
              {abaAtiva === tab.key && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          {abaAtiva === 'movimentacoes' ? (
            <motion.div
              key="movimentacoes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <MovimentacaoTabela
                movimentacoes={movimentacoes}
                onNovaMovimentacao={() => setModalMovimentacao(true)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ── Block 3: Informações do Produto ── */}
        <AnimatePresence mode="wait">
          {abaAtiva === 'informacoes' && (
        <motion.div
          key="informacoes"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info size={15} className="text-white/30" />
            <h2 className="text-sm font-semibold text-white">Informações do Produto</h2>
            {isEditing && (
              <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-2 py-0.5 ml-1">
                Editando
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {/* Left column */}
            <div>
              <InfoField
                icon={Tag} label="Nome"
                display={produto.nome}
                editKey="nome" isEditing={isEditing} editValues={editValues} onChange={handleChange}
              />
              <InfoField
                icon={Hash} label="SKU"
                display={<span className="font-mono">{produto.sku}</span>}
                isEditing={isEditing} editValues={editValues} onChange={handleChange}
                editable={false}
              />
              <InfoField
                icon={Barcode} label="Código de Barras"
                display={<span className="font-mono text-xs">{produto.codigo_barras}</span>}
                isEditing={isEditing} editValues={editValues} onChange={handleChange}
                editable={false}
              />
              <InfoField
                icon={Building2} label="Marca"
                display={produto.marca}
                editKey="marca" isEditing={isEditing} editValues={editValues} onChange={handleChange}
              />
              <CategoriaField
                isEditing={isEditing} editValues={editValues} onChange={handleChange}
                display={categoriaEdit?.nome ?? '—'}
              />
              <InfoField
                icon={Ruler} label="Unidade de Medida"
                display={produto.unidade_medida}
                isEditing={isEditing} editValues={editValues} onChange={handleChange}
                editable={false}
              />
            </div>

            {/* Right column */}
            <div>
              <InfoField
                icon={TrendingDown} label="Preço de Custo"
                display={<span className="text-white/50">{formatCurrency(produto.preco_custo)}</span>}
                editKey="preco_custo" isEditing={isEditing} editValues={editValues} onChange={handleChange}
                type="number"
              />
              <InfoField
                icon={DollarSign} label="Preço de Venda"
                display={<span className="text-emerald-400 font-medium">{formatCurrency(produto.preco_venda)}</span>}
                editKey="preco_venda" isEditing={isEditing} editValues={editValues} onChange={handleChange}
                type="number"
              />
              <InfoField
                icon={Tag} label="Preço Promocional"
                display={
                  produto.preco_promocional
                    ? <span className="text-cyan-400 font-medium">{formatCurrency(produto.preco_promocional)}</span>
                    : <span className="text-white/25 text-xs italic">Sem promoção ativa</span>
                }
                editKey="preco_promocional" isEditing={isEditing} editValues={editValues} onChange={handleChange}
                type="number"
              />
              {/* Margem — always derived, not editable */}
              <div className="flex items-start gap-3 py-3 border-b border-white/5">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingDown size={13} className="text-white/35" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-1">Margem de Lucro</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/80">{margemEdit}%</span>
                    {margemEdit !== '—' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-medium">
                        {margemEdit}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <InfoField
                icon={MapPin} label="Localização"
                display={estoque.localizacao}
                editKey="localizacao" isEditing={isEditing} editValues={editValues} onChange={handleChange}
              />
              <InfoField
                icon={CalendarDays} label="Cadastrado em"
                display={produto.criado_em}
                isEditing={isEditing} editValues={editValues} onChange={handleChange}
                editable={false}
              />
            </div>
          </div>

          {/* Product image below grid */}
          <div className="mt-5 pt-5 border-t border-white/5 flex items-center gap-4">
            {produto.imagem_url ? (
              <img
                src={produto.imagem_url}
                alt={produto.nome}
                className="w-24 h-24 rounded-xl object-cover border border-white/10"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ImageOff size={24} className="text-white/20" />
              </div>
            )}
            <div>
              <p className="text-xs text-white/30 mb-1">Imagem do produto</p>
              <p className="text-xs text-white/20 font-mono truncate max-w-xs">{produto.imagem_url || '—'}</p>
            </div>
          </div>
        </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Modals ── */}
      <ModalDesativarProduto
        open={modalDesativar}
        onClose={() => setModalDesativar(false)}
        onConfirm={handleToggleStatus}
        nomeProduto={produto.nome}
        statusAtual={produto.ativo}
      />

      <ModalMovimentacao
        open={modalMovimentacao}
        onClose={() => setModalMovimentacao(false)}
        onConfirm={handleNovaMovimentacao}
        estoqueAtual={estoque.estoque_atual}
        estoqueMinimo={estoque.estoque_minimo}
        nomeProduto={produto.nome}
      />
    </>
  )
}
