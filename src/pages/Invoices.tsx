import { useState } from 'react'
import { FileUpload } from '../components/features/FileUpload'
import { FileText, Download, CheckCircle, Clock, Sparkles, Filter, MoreHorizontal, Inbox } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { formatCurrency } from '../lib/utils'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '../components/ui/empty'
import { useAppStore } from '../store/useAppStore'

export const Invoices = () => {
  const { organization } = useAppStore()
  const [invoices, setInvoices] = useState([
    { id: '1', carrier: 'UnitedHealthcare', period: 'Oct 2024', amount: 145200, status: 'processed', date: '2024-11-05' },
    { id: '2', carrier: 'CVS Caremark', period: 'Oct 2024', amount: 42000, status: 'processed', date: '2024-11-07' },
    { id: '3', carrier: 'UnitedHealthcare', period: 'Nov 2024', amount: 148500, status: 'pending', date: '2024-12-05' },
  ])

  const handleUpload = async (file: File) => {
    // Simulate API call using the file name
    console.info(`Ingesting: ${file.name}`)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newInvoice = {
          id: Math.random().toString(),
          carrier: 'Aetna Signature',
          period: 'Dec 2024',
          amount: 156340,
          status: 'pending',
          date: new Date().toISOString().split('T')[0]
        }
        setInvoices([newInvoice, ...invoices])
        resolve()
      }, 2000)
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Invoice Intelligence
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Automated ingestion and auditing of carrier expenditures.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Filter}>Filter</Button>
          <Button variant="secondary" icon={Download}>Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-blue-500/20 shadow-blue-500/5">
            <CardHeader>
              <CardTitle className="text-lg">Ingest Invoice</CardTitle>
              <CardDescription>Upload carrier bills for real-time parsing and validation.</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onUpload={handleUpload} allowedExtensions={['.pdf', '.csv']} />
              <div className="mt-6 p-5 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/10 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles size={48} />
                </div>
                <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <CheckCircle size={16} />
                  Algorithmic Validation
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Financial AI automatically reconciles carrier identifiers, enrollment counts, and premium totals against contract baselines.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-950/40 border-b border-slate-800/80">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Audit Ledger — {organization?.name}</CardTitle>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Showing Latest Invoices</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-slate-500 uppercase text-[10px] tracking-widest font-extrabold bg-slate-900/10">
                      <th className="px-8 py-5">Carrier Entity</th>
                      <th className="px-8 py-5">Billing Cycle</th>
                      <th className="px-8 py-5">Value</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {invoices.map((invoice, i) => (
                      <tr key={invoice.id} className="group hover:bg-slate-900/50 transition-all duration-300 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 100}ms` }}>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-800/50 rounded-xl text-slate-400 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300 shadow-inner">
                              <FileText size={18} />
                            </div>
                            <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{invoice.carrier}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-slate-300 font-medium">{invoice.period}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Due {invoice.date}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 font-extrabold text-white tabular-nums text-lg">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-8 py-5">
                          {invoice.status === 'processed' ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle size={14} />
                              Audited
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Clock size={14} className="animate-spin-slow" />
                              Parsing
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                            <MoreHorizontal size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {invoices.length === 0 && (
                <Empty className="py-20">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Inbox size={32} />
                    </EmptyMedia>
                    <EmptyTitle>No Invoices Found</EmptyTitle>
                    <EmptyDescription>You have not uploaded any invoices yet.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
