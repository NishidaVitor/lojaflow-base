import { FileText, Table, Download } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

export function ExportacaoRelatorio() {
  const { showToast } = useToast()

  const handle = () => {
    showToast('Funcionalidade de exportação em desenvolvimento', 'info')
  }

  return (
    <div className="border-t border-white/10 pt-4 mt-2">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/50 mb-2">Exportar relatório:</p>
          <div className="flex gap-2">
            <button
              onClick={handle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500/10 rounded-lg transition-colors"
            >
              <FileText size={13} />
              PDF
            </button>
            <button
              onClick={handle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/10 rounded-lg transition-colors"
            >
              <Table size={13} />
              Excel
            </button>
            <button
              onClick={handle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10 rounded-lg transition-colors"
            >
              <Download size={13} />
              CSV
            </button>
          </div>
        </div>
        <p className="text-xs text-white/30">Dados referentes ao período filtrado</p>
      </div>
    </div>
  )
}
