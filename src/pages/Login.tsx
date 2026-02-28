import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Shield, Mail, Lock, ArrowRight, Sparkles, User, Building, Check } from 'lucide-react'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'
import { Card, CardContent } from '../components/common/Card'
import { toast } from 'sonner'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      toast.success('Successfully signed in')
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Failed to sign in')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim()) {
      toast.error('Please enter your full name')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'employer_admin',
            organization_name: organizationName || 'Your Organization'
          }
        }
      })
      if (error) throw error
      setSuccess(true)
      toast.success('Check your email for a verification link')
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Failed to sign up')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full scale-150" />
        <Card className="max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Mail size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Email verification sent</h2>
            <p className="text-slate-400 mb-10 leading-relaxed">
              We've sent a secure confirmation link to <span className="text-blue-400 font-bold">{email}</span>. Please check your inbox to continue.
            </p>
            <Button
              variant="outline"
              onClick={() => setSuccess(false)}
              fullWidth={true}
              className="w-full"
            >
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent_70%)]" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />

      <div className="max-w-md w-full space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-4">
          <div className="relative inline-flex mb-2">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl shadow-blue-500/20 transform hover:scale-110 transition-transform duration-500 cursor-default">
              <Shield className="text-white" size={40} />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
              BenefitsIQ <Sparkles className="text-blue-400" size={20} />
            </h1>
            <p className="text-slate-400 font-medium text-lg">Predictive Financial Intelligence</p>
          </div>
        </div>

        <Card className="border-slate-800/50 shadow-2xl overflow-visible">
          <CardContent className="p-8 space-y-8">
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
              {isSignUp && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    icon={User}
                  />
                  <Input
                    label="Organization Name"
                    type="text"
                    placeholder="Acme Corp"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                    icon={Building}
                  />
                </div>
              )}

              <Input
                label="Corporate Email"
                type="email"
                placeholder="exec@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={Mail}
              />

              <Input
                label="Security Key"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={Lock}
              />

              <div className="space-y-4 pt-2">
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full h-14 text-lg font-bold shadow-blue-500/20"
                  icon={isSignUp ? Check : ArrowRight}
                  iconPosition="right"
                >
                  {isSignUp ? 'Create Account' : 'Enter Platform'}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest text-slate-500">
                    <span className="bg-slate-900/50 px-4">OR</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSignUp(!isSignUp)}
                  disabled={isLoading}
                  className="w-full h-12 font-bold"
                >
                  {isSignUp ? 'Back to Login' : 'Create New Organization'}
                </Button>
              </div>
            </form>

            <div className="pt-2 text-center space-y-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                By entering, you confirm access to sensitive fiduciary data.
                <br />
                Enterprise SSO active for managed tenants.
              </p>
              <div className="flex items-center justify-center gap-6 text-[10px] text-slate-600 font-bold uppercase tracking-widest border-t border-slate-800/50 pt-4">
                <a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Terms</a>
                <a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Privacy</a>
                <a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Compliance</a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
