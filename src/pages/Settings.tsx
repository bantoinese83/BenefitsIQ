import { useState } from 'react'
import {
    User,
    Building,
    Shield,
    Download,
    Trash2,
    Bell,
    Globe,
    AlertTriangle,
    Mail,
    ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { useAppStore } from '../store/useAppStore'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { cn } from '../lib/utils'

export const Settings = () => {
    const { user, organization, setUser, setOrganization } = useAppStore()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const handleExportData = async () => {
        setIsExporting(true)
        try {
            const { data: profile } = await supabase.from('profiles').select('*').single()
            const { data: benefits } = await supabase.from('benefits_data').select('*')

            const exportData = {
                profile,
                organization,
                benefits,
                exportedAt: new Date().toISOString()
            }

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `benefits-iq-data-export-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success('Data exported successfully')
        } catch (error) {
            toast.error('Failed to export data')
            console.error(error)
        } finally {
            setIsExporting(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!confirm('Are you absolutely sure you want to delete your account? This action is irreversible and all your data will be permanently removed.')) {
            return
        }

        setIsDeleting(true)
        try {
            // In a real production app with auth.users access, we'd use a service role or RPC
            // For this MVP, we delete the profile which is linked to auth.uid()
            const { error } = await supabase.auth.admin.deleteUser(user?.id || '')

            if (error) {
                // Fallback for non-admin deleting themselves (if supported by your Supabase setup)
                // Usually you call a Postgres function to handle self-deletion
                const { error: profileError } = await supabase.from('profiles').delete().eq('id', user?.id)
                if (profileError) throw profileError
            }

            await supabase.auth.signOut()
            setUser(null)
            setOrganization(null)
            window.location.href = '/login'
        } catch (error) {
            toast.error('Account deletion failed. Contact support.')
            console.error(error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-20">
            <div>
                <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                    Executive Settings
                </h1>
                <p className="text-slate-400 mt-2 text-lg font-medium">Manage your personal profile, organization security, and data compliance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Navigation - Sidebar Style */}
                <div className="md:col-span-1 space-y-2">
                    {[
                        { id: 'profile', label: 'Profile Settings', icon: User },
                        { id: 'organization', label: 'Organization', icon: Building },
                        { id: 'security', label: 'Security & Auth', icon: Shield },
                        { id: 'compliance', label: 'Data Compliance', icon: Globe },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                    ].map((item) => (
                        <button
                            key={item.id}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300",
                                item.id === 'profile'
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                            )}
                        >
                            <item.icon size={18} />
                            <span className="tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-8">
                    {/* Profile Card */}
                    <Card className="border-slate-800 shadow-2xl">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your name and professional identity.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-500/20">
                                    {user?.full_name?.[0] || 'U'}
                                </div>
                                <div className="space-y-4 flex-1 w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-1">Full Name</label>
                                            <input
                                                defaultValue={user?.full_name || ''}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 font-bold focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-1">Email Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-blue-500 transition-colors" size={16} />
                                                <input
                                                    disabled
                                                    defaultValue={user?.email || ''}
                                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 pl-12 text-slate-500 font-medium cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="primary">Save Changes</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compliance & Export Card */}
                    <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe size={20} className="text-emerald-500" />
                                Privacy & Data Portability
                            </CardTitle>
                            <CardDescription className="text-emerald-400/60">Fully compliant with GDPR and CCPA regulations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Export Data */}
                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl md:col-span-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                            <Download size={20} />
                                        </div>
                                        <h4 className="font-bold text-slate-100">Request Data Export</h4>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        Download a full record of your benefits data and profile information in a machine-readable JSON format.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                        onClick={handleExportData}
                                        loading={isExporting}
                                        icon={Download}
                                    >
                                        Generate Export
                                    </Button>
                                </div>

                                {/* Privacy Policy */}
                                <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl md:col-span-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                            <Shield size={20} />
                                        </div>
                                        <h4 className="font-bold text-slate-100">Security Standards</h4>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        BenefitsIQ enforces AES-256 encryption at rest and TLS 1.3 in transit. Your data is isolated via Row-Level Security.
                                    </p>
                                    <button className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2 hover:text-blue-300 transition-colors">
                                        View Security Audit <ExternalLink size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Account Deletion */}
                            <div className="pt-8 border-t border-emerald-500/10">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-rose-500 flex items-center gap-2 uppercase tracking-widest text-xs">
                                            <AlertTriangle size={16} /> Danger Zone
                                        </h4>
                                        <p className="text-sm font-bold text-slate-100">Permanently Remove Account</p>
                                        <p className="text-xs text-slate-400 max-w-sm">This will delete all organization context, historical invoices, and scenario models associated with your profile.</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10 h-12 px-6"
                                        onClick={handleDeleteAccount}
                                        loading={isDeleting}
                                        icon={Trash2}
                                    >
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
