import { TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, type LucideIcon, Sparkles } from 'lucide-react'
import { cn, formatCurrency } from '../lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/common/Card'
import { useAppStore } from '../store/useAppStore'
import { useBenefits } from '../hooks/useBenefits'
import { useMemo } from 'react'
import { Skeleton } from '../components/ui/skeleton'

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
  loading?: boolean
}

const StatCard = ({ title, value, change, trend, icon: Icon, loading = false }: StatCardProps) => (
  <Card className="group">
    <CardContent className="p-6">
      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform duration-300">
              <Icon size={24} />
            </div>
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors",
              trend === 'up'
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            )}>
              {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {change}%
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium mb-1 tracking-tight">{title}</p>
            <h3 className="text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{value}</h3>
          </div>
        </>
      )}
    </CardContent>
  </Card>
)

export const Dashboard = () => {
  const { benefitData, isLoading } = useAppStore()
  useBenefits()

  const totals = useMemo(() => {
    const totalSpend = benefitData.reduce((sum, p) => sum + (Number(p.employer_premium) + Number(p.employee_premium)) * p.employee_count, 0)
    const totalEmployees = benefitData.reduce((sum, p) => sum + p.employee_count, 0)
    const avgCost = totalEmployees > 0 ? totalSpend / totalEmployees : 0

    return {
      totalSpend,
      totalEmployees,
      avgCost
    }
  }, [benefitData])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400">
          Executive Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Welcome back. Here is your real-time benefits financial intelligence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Benefits Spend"
          value={formatCurrency(totals.totalSpend)}
          change="8.2"
          trend="up"
          icon={DollarSign}
          loading={isLoading}
        />
        <StatCard
          title="Avg. Cost per Employee"
          value={formatCurrency(totals.avgCost)}
          change="3.1"
          trend="down"
          icon={Users}
          loading={isLoading}
        />
        <StatCard
          title="Projected Savings"
          value={formatCurrency(totals.totalSpend * 0.12)}
          change="12.5"
          trend="up"
          icon={TrendingUp}
          loading={isLoading}
        />
        <StatCard
          title="Invoice Variance"
          value="1.4%"
          change="0.2"
          trend="down"
          icon={DollarSign}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spend Overview</CardTitle>
            <CardDescription>Monthly benefits expenditure for the current fiscal year.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-end justify-between gap-3 px-2">
              {[45, 60, 55, 75, 90, 85, 100, 95, 110, 105, 120, 115].map((val, i) => (
                <div key={i} className="group/bar relative flex-1">
                  <div
                    className="w-full bg-blue-600/20 group-hover/bar:bg-blue-500 transition-all duration-500 rounded-t-lg relative overflow-hidden"
                    style={{ height: `${val}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold border border-slate-700">
                    {formatCurrency((totals.totalSpend / 12) * (val / 100) * 2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4">
            <Sparkles className="text-blue-500/20 group-hover:text-blue-500/40 transition-colors duration-500" size={64} />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Claude Insights
            </CardTitle>
            <CardDescription>AI-generated financial intelligence based on your data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-colors duration-300">
              <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                "Your pharmacy spend has increased by 15% this quarter, primarily driven by specialty drug utilization. Consider reviewing your PBM contract for potential optimizations."
              </p>
            </div>
            <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 hover:border-indigo-500/30 transition-colors duration-300">
              <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                "Benchmark data shows your HDHP enrollment is 10% below industry average. An HSA contribution matching strategy could drive more adoption."
              </p>
            </div>
            <div className="pt-4">
              <button className="text-sm text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-1 group/btn">
                Generate Full Report
                <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
