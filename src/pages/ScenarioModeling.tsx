import { useState, useMemo } from 'react'
import { Calculator, FileText, Save, Plus, Trash2, Cpu, ArrowRight, DollarSign } from 'lucide-react'
import { useScenarioCalculation } from '../services/calculationEngine'
import { ClaudeService } from '../services/claudeService'
import { useAppStore } from '../store/useAppStore'
import { useBenefits } from '../hooks/useBenefits'
import type { ScenarioAdjustment } from '../types'
import { cn, formatCurrency } from '../lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Skeleton } from '../components/ui/skeleton'

export const ScenarioModeling = () => {
  const { benefitData } = useAppStore()
  useBenefits()

  const [adjustments, setAdjustments] = useState<ScenarioAdjustment[]>([])
  const [isCalculated, setIsCalculated] = useState(false)
  const [insight, setInsight] = useState<string | null>(null)
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false)

  const results = useScenarioCalculation(benefitData, adjustments)

  const baselineTotal = useMemo(() =>
    benefitData.reduce((sum, p) => sum + (Number(p.employer_premium) + Number(p.employee_premium)) * p.employee_count, 0),
    [benefitData])

  const handleAddAdjustment = (type: ScenarioAdjustment['type'], value: number) => {
    const newAdjustment: ScenarioAdjustment = { type, value }
    setAdjustments(prev => [...prev, newAdjustment])
    setIsCalculated(false)
  }

  const handleRemoveAdjustment = (index: number) => {
    setAdjustments(prev => prev.filter((_, i) => i !== index))
    setIsCalculated(false)
  }

  const handleCalculate = async () => {
    setIsCalculated(true)
    setIsGeneratingInsight(true)
    try {
      const text = await ClaudeService.generateScenarioInsight({
        scenarioName: 'Projected Renewal 2025',
        baselineCost: baselineTotal,
        projectedCost: results.projected_total_cost,
        adjustments: adjustments.map(a => `${a.type.replace('_', ' ')} by ${a.value * 100}%`)
      })
      setInsight(text)
    } catch (error) {
      console.error(error)
      setInsight("Unable to generate AI insights at this time.")
    } finally {
      setIsGeneratingInsight(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Scenario Modeling
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Test financial outcomes for future benefits configurations.</p>
        </div>
        <Button variant="primary" icon={Save} size="lg">Save Scenario</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Adjustment Controls */}
        <div className="lg:col-span-4 space-y-6 sticky top-8">
          <Card className="border-blue-500/20 shadow-blue-500/5">
            <CardHeader>
              <CardTitle className="text-lg">Financial Inputs</CardTitle>
              <CardDescription>Configure the variables for your projection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Premium Adjustments</label>
                <div className="grid grid-cols-3 gap-2">
                  {[0.05, 0.10, -0.05].map(val => (
                    <Button
                      key={val}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddAdjustment('premium_change', val)}
                      className="text-xs"
                    >
                      {val > 0 ? '+' : ''}{val * 100}%
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Plan Design Shifts</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => handleAddAdjustment('deductible_change', 0.20)}
                  >
                    ↑ Deductible
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => handleAddAdjustment('deductible_change', -0.20)}
                  >
                    ↓ Deductible
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/50">
                <Button
                  onClick={handleCalculate}
                  className="w-full h-14 text-lg"
                  icon={Calculator}
                >
                  Model Results
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Active Queue</CardTitle>
              {adjustments.length > 0 && (
                <button
                  onClick={() => { setAdjustments([]); setIsCalculated(false); setInsight(null); }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold uppercase tracking-widest"
                >
                  Clear
                </button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adjustments.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                    <Plus className="mx-auto mb-2 opacity-20" size={24} />
                    <p className="text-xs font-medium">Add variables to begin</p>
                  </div>
                ) : (
                  adjustments.map((a, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-all">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-tighter mb-0.5">{a.type.replace('_', ' ')}</p>
                        <p className={cn("text-lg font-bold tabular-nums", a.value > 0 ? "text-rose-400" : "text-emerald-400")}>
                          {a.value > 0 ? '+' : ''}{a.value * 100}%
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveAdjustment(i)}
                        className="p-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-500 transition-all hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          {isCalculated ? (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-900 to-blue-950/20">
                  <CardHeader>
                    <CardTitle className="text-slate-400 font-medium text-sm flex items-center gap-2">
                      <DollarSign size={16} /> Projected Expenditure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-extrabold tracking-tighter text-white tabular-nums">
                      {formatCurrency(results.projected_total_cost)}
                    </div>
                    <div className={cn(
                      "mt-4 flex items-center gap-2 font-bold px-3 py-1 rounded-lg w-fit text-sm transition-all animate-in slide-in-from-left-2",
                      results.delta_from_baseline > 0 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    )}>
                      {results.delta_from_baseline > 0 ? 'Cost Increase:' : 'Savings:'} {formatCurrency(Math.abs(results.delta_from_baseline))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900 to-indigo-950/20">
                  <CardHeader>
                    <CardTitle className="text-slate-400 font-medium text-sm flex items-center gap-2">
                      <Cpu size={16} /> Employer Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-extrabold tracking-tighter text-indigo-400 tabular-nums">
                      {formatCurrency(results.projected_employer_cost)}
                    </div>
                    <p className="mt-4 text-xs text-slate-500 font-medium leading-relaxed">
                      Optimized for current multi-tenant RLS policies and tax regulations.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-indigo-500/30 shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500" />
                <CardHeader className="bg-slate-950/40 border-b border-slate-800/80 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
                        <FileText size={20} className="text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Executive Analysis</CardTitle>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by Claude 3.5 Sonnet Intelligence</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <div className="p-8">
                  {isGeneratingInsight ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ) : insight ? (
                    <div className="flex gap-4">
                      <div className="text-blue-500 font-serif text-6xl leading-none select-none">“</div>
                      <p className="text-slate-200 text-lg leading-relaxed font-medium italic">
                        {insight}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-slate-500">Run the model to generate AI-driven narrative analysis.</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Comparison Bar */}
              <Card>
                <CardContent className="p-0">
                  <div className="flex items-center">
                    <div className="flex-1 p-6 border-r border-slate-800">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Baseline</p>
                      <p className="text-xl font-bold text-slate-400 line-through">
                        {formatCurrency(baselineTotal)}
                      </p>
                    </div>
                    <div className="flex-none px-4">
                      <ArrowRight className="text-slate-700" size={24} />
                    </div>
                    <div className="flex-1 p-6">
                      <p className="text-xs font-bold text-blue-500 uppercase mb-1">Projection</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {formatCurrency(results.projected_total_cost)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-800/50 rounded-3xl flex flex-col items-center justify-center text-slate-500 bg-slate-900/10 hover:bg-slate-900/20 transition-colors duration-500">
              <div className="bg-slate-900/50 p-8 rounded-full mb-6 border border-slate-800 shadow-2xl">
                <Calculator size={64} className="opacity-10 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-slate-300">Predictive Modeling Engine</p>
              <p className="text-slate-500 mt-2 max-w-sm text-center px-4">
                Select your variables on the left and click "Model Results" to visualize financial outcomes and generate AI insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
