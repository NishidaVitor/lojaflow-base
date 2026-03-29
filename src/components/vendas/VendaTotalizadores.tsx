import { motion } from 'framer-motion'
import { ShoppingBag, TrendingUp, Calendar, Clock } from 'lucide-react'
import type { Venda } from '@/types/venda'

interface Props {
  vendas: Venda[]
}

function Card({
  icon: Icon,
  label,
  value,
  sub,
  color,
  delay,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 flex items-start gap-4"
    >
      <div className={`p-2.5 rounded-lg ${color} shrink-0`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-white/40 font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-xl font-bold text-white leading-none">{value}</p>
        {sub && <p className="text-[11px] text-white/30 mt-1">{sub}</p>}
      </div>
    </motion.div>
  )
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function isToday(dateStr: string) {
  const [d] = dateStr.split(' ')
  const [day, mon, yr] = d.split('/')
  const date = new Date(Number(yr), Number(mon) - 1, Number(day))
  const today = new Date()
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
}

function isThisMonth(dateStr: string) {
  const [d] = dateStr.split(' ')
  const [, mon, yr] = d.split('/')
  const today = new Date()
  return Number(mon) === today.getMonth() + 1 && Number(yr) === today.getFullYear()
}

export function VendaTotalizadores({ vendas }: Props) {
  const ativas = vendas.filter((v) => v.status !== 'cancelada' && v.status !== 'devolvida')

  const hoje = ativas.filter((v) => isToday(v.criado_em))
  const totalHoje = hoje.reduce((acc, v) => acc + v.total, 0)

  const mes = ativas.filter((v) => isThisMonth(v.criado_em))
  const totalMes = mes.reduce((acc, v) => acc + v.total, 0)

  const ticketMedio = ativas.length > 0 ? ativas.reduce((acc, v) => acc + v.total, 0) / ativas.length : 0

  const pendentes = vendas.filter((v) => v.status === 'orcamento' || v.status === 'confirmada' || v.status === 'em_separacao').length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card icon={ShoppingBag}  label="Vendas Hoje"   value={String(hoje.length)}   sub={fmt(totalHoje)}          color="bg-indigo-500/20 text-indigo-300"  delay={0}    />
      <Card icon={TrendingUp}   label="Ticket Médio"  value={fmt(ticketMedio)}       sub={`${ativas.length} vendas ativas`} color="bg-emerald-500/20 text-emerald-300" delay={0.05} />
      <Card icon={Calendar}     label="Vendas do Mês" value={String(mes.length)}    sub={fmt(totalMes)}           color="bg-blue-500/20 text-blue-300"      delay={0.1}  />
      <Card icon={Clock}        label="Pendentes"     value={String(pendentes)}      sub="orç. + conf. + sep."     color="bg-amber-500/20 text-amber-300"    delay={0.15} />
    </div>
  )
}
