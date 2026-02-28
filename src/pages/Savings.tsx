import { TrendingDown, Sparkles, Zap, ArrowRight, Target, ShieldCheck, Activity } from 'lucide-react'
import { cn } from '../lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { useAppStore } from '../store/useAppStore'

export const Savings = () => {
  const { organization } = useAppStore()
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Savings Intelligence
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Predictive identification and capture of cost optimization vectors.</p>
        </div>
        <Button variant="primary" icon={Target} size="lg" className="shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 border-none text-white">
          Optimize All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <Card className="bg-gradient-to-br from-slate-900 to-emerald-950/20 border-emerald-500/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingDown size={120} />
            </div>
            <CardContent className="p-10">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl shadow-inner">
                      <TrendingDown size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100">Annual Captured Potential</h3>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-7xl font-black text-white tracking-tighter tabular-nums">$342,000</h4>
                    <p className="text-slate-400 font-bold text-lg uppercase tracking-widest flex items-center gap-2">
                      Validated Opportunities <Badge variant="info" className="ml-2">4 Active</Badge>
                    </p>
                  </div>

                  <Button variant="primary" size="lg" className="h-14 px-10 text-lg bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20" icon={ArrowRight} iconPosition="right">
                    Execute Strategic Plan
                  </Button>
                </div>

                <div className="relative w-56 h-56 flex-shrink-0 group/chart">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-900/50" />
                    <circle
                      cx="50" cy="50" r="42"
                      stroke="url(#emeraldGradient)"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray="263.89"
                      strokeDashoffset="79.17"
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out group-hover/chart:stroke-[12px]"
                    />
                    <defs>
                      <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col animate-in zoom-in-50 duration-700">
                    <span className="text-4xl font-black text-white tracking-tighter">70%</span>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Captured</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'PBM Contract Optimization', amount: '$125,000', impact: 'High', type: 'Contractual', icon: ShieldCheck },
              { title: 'HDHP Engagement Strategy', amount: '$85,000', impact: 'Medium', type: 'Engagement', icon: Target },
              { title: 'Network Leakage Reduction', amount: '$62,000', impact: 'Medium', type: 'Clinical', icon: Activity },
              { title: 'Eligibility Integrity Audit', amount: '$70,000', impact: 'High', type: 'Admin', icon: ShieldCheck },
            ].map((opp, i) => (
              <Card key={i} className="hover:border-blue-500/30 transition-all duration-500 group/item">
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-slate-950/50 rounded-2xl text-slate-500 group-hover/item:text-blue-400 group-hover/item:bg-blue-400/10 transition-all shadow-inner">
                      <opp.icon size={24} />
                    </div>
                    <Badge variant={opp.impact === 'High' ? 'destructive' : 'warning'}>
                      {opp.impact} Impact
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">{opp.type}</p>
                    <h4 className="font-extrabold text-xl text-slate-100 mb-2 truncate group-hover/item:text-blue-400 transition-colors">{opp.title}</h4>
                    <p className="text-3xl font-black text-emerald-400 tabular-nums">{opp.amount}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="relative overflow-hidden group bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border-indigo-500/20">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={64} className="text-indigo-400" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-400">
                <Sparkles size={20} />
                Clinical Narrative
              </CardTitle>
              <CardDescription className="text-slate-400 font-medium">AI-driven clinical cost insights for {organization?.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200 text-lg leading-relaxed font-medium italic mb-8">
                "Your diabetic population is showing a 12% higher complication rate than benchmark. Implementing a proactive chronic condition management program could yield $45k in annual savings while improving member outcomes."
              </p>
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-4 text-indigo-400 animate-pulse-slow">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                  <Zap size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em]">Strategy Optimized</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Capture Velocity</CardTitle>
              <CardDescription>Real-time tracking of saving realization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {[
                { label: 'Contracting', progress: 100, color: 'bg-emerald-500' },
                { label: 'Employee Comms', progress: 45, color: 'bg-blue-500' },
                { label: 'Network Steering', progress: 20, color: 'bg-indigo-500' },
              ].map((p, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-slate-500">{p.label}</span>
                    <span className="text-slate-200">{p.progress}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                    <div
                      className={cn("h-full rounded-full transition-all duration-1000 ease-in-out", p.color)}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
