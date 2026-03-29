import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Store,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/produtos', icon: Package, label: 'Produtos' },
  { to: '/vendas', icon: ShoppingCart, label: 'Vendas' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/relatorios', icon: BarChart3, label: 'Relatórios' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
]

function NavItem({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string
  icon: React.ElementType
  label: string
  onClick?: () => void
}) {
  const location = useLocation()
  const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
        isActive
          ? 'bg-primary/10 text-white'
          : 'text-white/50 hover:text-white/80 hover:bg-white/5'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <Icon
        size={18}
        className={cn(
          'transition-colors',
          isActive ? 'text-primary' : 'text-white/40 group-hover:text-white/60'
        )}
      />
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId="active-bg"
          className="absolute inset-0 rounded-xl bg-primary/8 -z-10"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </NavLink>
  )
}

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#16161D] border-r border-[#2A2A3A]">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[#2A2A3A]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Store size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold text-base tracking-tight">LojaFlow</span>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-4 mb-2">
          Menu
        </p>
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            onClick={isMobile ? onClose : undefined}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2A2A3A]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-semibold">
            VN
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/90 truncate">Vitor Nishida</p>
            <p className="text-xs text-white/40 truncate">Admin</p>
          </div>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
        {/* Drawer */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: isOpen ? 0 : -280 }}
          transition={{ type: 'spring', stiffness: 380, damping: 35 }}
          className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
        >
          {sidebarContent}
        </motion.aside>
      </>
    )
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0">
      {sidebarContent}
    </aside>
  )
}
