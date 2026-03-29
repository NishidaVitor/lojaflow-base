import { motion } from 'framer-motion'
import type { PeriodoOpcao } from '@/utils/relatorios'

interface FiltrosProps {
  onAplicar: () => void
  onLimpar: () => void
  children: React.ReactNode
}

export function FiltrosRelatorio({ onAplicar, onLimpar, children }: FiltrosProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
    >
      <div className="flex flex-wrap gap-4 items-end">
        {children}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={onLimpar}
            className="px-3 py-2 text-sm text-white/50 hover:text-white/80 rounded-lg transition-colors hover:bg-white/5"
          >
            Limpar
          </button>
          <button
            onClick={onAplicar}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Reutilizáveis entre relatórios ──────────────────────────────────────────

interface SelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
  className?: string
}

export function FilterSelect({ label, value, onChange, children, className = '' }: SelectProps) {
  return (
    <div className={className}>
      <label className="text-xs text-white/40 block mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#1C1C26] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500/50 cursor-pointer min-w-[140px]"
      >
        {children}
      </select>
    </div>
  )
}

export function PeriodoSelect({
  value,
  onChange,
}: {
  value: PeriodoOpcao
  onChange: (v: PeriodoOpcao) => void
}) {
  return (
    <FilterSelect label="Período" value={value} onChange={(v) => onChange(v as PeriodoOpcao)}>
      <option value="hoje">Hoje</option>
      <option value="semana">Esta Semana</option>
      <option value="mes">Este Mês</option>
      <option value="3meses">Últimos 3 Meses</option>
      <option value="ano">Este Ano</option>
      <option value="personalizado">Personalizado</option>
    </FilterSelect>
  )
}

export function PeriodoPersonalizado({
  inicio,
  fim,
  onChangeInicio,
  onChangeFim,
}: {
  inicio: string
  fim: string
  onChangeInicio: (v: string) => void
  onChangeFim: (v: string) => void
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      <div>
        <label className="text-xs text-white/40 block mb-1">De</label>
        <input
          type="date"
          value={inicio}
          onChange={(e) => {
            const [y, m, d] = e.target.value.split('-')
            onChangeInicio(`${d}/${m}/${y}`)
          }}
          className="bg-[#1C1C26] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500/50"
        />
      </div>
      <div>
        <label className="text-xs text-white/40 block mb-1">Até</label>
        <input
          type="date"
          value={fim}
          onChange={(e) => {
            const [y, m, d] = e.target.value.split('-')
            onChangeFim(`${d}/${m}/${y}`)
          }}
          className="bg-[#1C1C26] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500/50"
        />
      </div>
    </div>
  )
}
