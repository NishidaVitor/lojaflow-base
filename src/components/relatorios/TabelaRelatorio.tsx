import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export interface TabelaColumn {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  className?: string
  render?: (row: Record<string, unknown>, index: number) => React.ReactNode
}

interface Props {
  columns: TabelaColumn[]
  data: Record<string, unknown>[]
  title?: string
  emptyMessage?: string
  delay?: number
}

const stagger = {
  animate: { transition: { staggerChildren: 0.04 } },
}
const rowVariant = {
  initial: { opacity: 0, x: -4 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
}

const alignClass = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
}

export function TabelaRelatorio({
  columns,
  data,
  title = 'Detalhamento',
  emptyMessage = 'Nenhum dado encontrado',
  delay = 0.4,
}: Props) {
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setShowAll(false)
  }, [data])

  const displayed = showAll ? data : data.slice(0, 10)
  const hasMore = data.length > 10

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <p className="text-sm font-semibold text-white/70">{title}</p>
        <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
          {data.length} {data.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-white/30">
          <p className="text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wider ${alignClass[col.align || 'left']} ${col.className || ''}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <motion.tbody variants={stagger} initial="initial" animate="animate">
                {displayed.map((row, i) => (
                  <motion.tr
                    key={i}
                    variants={rowVariant}
                    className={`border-b border-white/5 last:border-0 transition-all hover:bg-indigo-500/5 hover:shadow-[inset_2px_0_0_rgba(99,102,241,0.4)] ${
                      i % 2 === 0 ? 'bg-white/0' : 'bg-white/[0.02]'
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-5 py-3 text-white/70 ${alignClass[col.align || 'left']} ${col.className || ''}`}
                      >
                        {col.render
                          ? col.render(row, i)
                          : String(row[col.key] ?? '-')}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>

          {hasMore && !showAll && (
            <div className="px-5 py-3 border-t border-white/5 flex justify-center">
              <button
                onClick={() => setShowAll(true)}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ChevronDown size={13} />
                Ver mais {data.length - 10} registros
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
