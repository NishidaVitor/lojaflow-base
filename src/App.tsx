import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ToastProvider } from '@/contexts/ToastContext'
import { Dashboard } from '@/pages/Dashboard'
import { ClientesListView } from '@/pages/Clientes/index'
import { ClienteDetalhe } from '@/pages/Clientes/ClienteDetalhe'
import { ProdutosListView } from '@/pages/Produtos/index'
import { ProdutoDetalhe } from '@/pages/Produtos/ProdutoDetalhe'
import { VendasListView } from '@/pages/Vendas/index'
import { NovaVenda } from '@/pages/Vendas/NovaVenda'
import { VendaDetalhe } from '@/pages/Vendas/VendaDetalhe'
import { Relatorios } from '@/pages/Relatorios/index'

import { Configuracoes } from '@/pages/Configuracoes/index'
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt'
import { PWAUpdatePrompt } from '@/components/pwa/PWAUpdatePrompt'

export default function App() {
  return (
    <ToastProvider>
      <PWAUpdatePrompt />
      <PWAInstallPrompt />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/produtos" element={<ProdutosListView />} />
            <Route path="/produtos/:id" element={<ProdutoDetalhe />} />
            <Route path="/vendas" element={<VendasListView />} />
            <Route path="/vendas/nova" element={<NovaVenda />} />
            <Route path="/vendas/:id" element={<VendaDetalhe />} />
            <Route path="/clientes" element={<ClientesListView />} />
            <Route path="/clientes/:id" element={<ClienteDetalhe />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
