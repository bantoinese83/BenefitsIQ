import { type ReactNode, useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Settings,
  LogOut,
  Menu,
  Activity,
  ShieldCheck,
  User,
  Bell,
  Sparkles
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { supabase } from '../../lib/supabase'
import { useAppStore } from '../../store/useAppStore'
import { Badge } from '../common/Badge'
import { AnimatedThemeToggler } from '../ui/animated-theme-toggler'

interface SidebarItemProps {
  to: string
  icon: ReactNode
  label: string
  active?: boolean
}

const SidebarItem = ({ to, icon, label, active }: SidebarItemProps) => (
  <Link
    to={to}
    className={cn(
      "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border border-transparent",
      active
        ? "bg-primary/10 text-primary border-primary/20 shadow-lg shadow-primary/5"
        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
    )}
  >
    <div className={cn(
      "p-1.5 rounded-lg transition-colors duration-300",
      active ? "bg-primary/20 text-primary" : "bg-background group-hover:bg-secondary"
    )}>
      {icon}
    </div>
    <span className={cn(
      "text-xs font-black uppercase tracking-[0.15em] transition-colors",
      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
    )}>
      {label}
    </span>
  </Link>
)

interface LayoutProps {
  children: ReactNode
}

export const DashboardLayout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, organization } = useAppStore()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/scenarios', icon: <TrendingUp size={18} />, label: 'Scenario Modeling' },
    { to: '/savings', icon: <Activity size={18} />, label: 'Savings Intelligence' },
    { to: '/benchmarks', icon: <ShieldCheck size={18} />, label: 'Benchmarks' },
    { to: '/invoices', icon: <FileText size={18} />, label: 'Invoices' },
    { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border flex flex-col transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8">
          <h1 className="text-2xl font-black flex items-center gap-3 tracking-tighter">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-700 rounded-xl flex items-center justify-center shadow-xl shadow-primary/20 transform rotate-3">
              <TrendingUp className="text-primary-foreground" size={24} />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:to-slate-400">BenefitsIQ</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Core Platform</p>
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              {...item}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="p-6 space-y-4">
          <div className="p-5 bg-gradient-to-br from-card to-background border border-border rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles size={48} />
            </div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Usage Credits</p>
            <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
              <div className="h-full bg-primary w-3/4" />
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">750 / 1000 AI tokens</p>
          </div>

          <button
            onClick={handleSignOut}
            className="group flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-300 border border-transparent hover:border-destructive/20"
          >
            <div className="p-1.5 bg-background group-hover:bg-destructive/20 rounded-lg transition-colors">
              <LogOut size={16} />
            </div>
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 bg-background relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[50%] h-[30%] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <header className="h-24 border-b border-border/50 flex items-center justify-between px-10 sticky top-0 z-30 bg-background/80 backdrop-blur-xl">
          <button
            className="lg:hidden p-3 bg-card rounded-xl text-muted-foreground hover:text-foreground transition-colors border border-border"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-6 ml-auto">
            <AnimatedThemeToggler />
            <button className="p-2.5 text-muted-foreground hover:text-primary transition-all hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/20 relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </button>
            <div className="h-8 w-[1px] bg-border" />
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">
                  {organization?.name || 'Organization Name'}
                </p>
                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 mt-0.5">
                  {user?.role?.replace('_', ' ') || 'User Role'}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-card border border-border flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-lg shadow-black/20 overflow-hidden">
                {user?.full_name ? (
                  <span className="text-primary text-xs">{user.full_name.split(' ').map(n => n[0]).join('')}</span>
                ) : (
                  <User size={20} className="text-muted-foreground group-hover:text-primary" />
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
