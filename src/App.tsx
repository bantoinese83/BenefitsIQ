import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { useAuth } from './hooks/useAuth'
import { Toaster } from './components/ui/sonner'
import { Spinner } from './components/ui/spinner'
import { ErrorBoundary } from './components/common/ErrorBoundary'

// Lazy Loading for Routes
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const ScenarioModeling = lazy(() => import('./pages/ScenarioModeling').then(m => ({ default: m.ScenarioModeling })))
const Invoices = lazy(() => import('./pages/Invoices').then(m => ({ default: m.Invoices })))
const Savings = lazy(() => import('./pages/Savings').then(m => ({ default: m.Savings })))
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))

const Benchmarks = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Benchmark Comparison</h1>
    <p className="text-slate-400 mt-4">Coming Soon</p>
  </div>
)

const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })))

const PageLoader = () => (
  <div className="min-h-[400px] w-full flex items-center justify-center">
    <Spinner className="text-primary size-8" />
  </div>
)

function App() {
  const { user, isInitializing } = useAuth()

  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="text-primary size-12" />
            <p className="text-muted-foreground animate-pulse font-medium">BenefitsIQ initializing...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  if (!user) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark">
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <BrowserRouter>
        <ErrorBoundary>
          <DashboardLayout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/scenarios" element={<ScenarioModeling />} />
                <Route path="/savings" element={<Savings />} />
                <Route path="/benchmarks" element={<Benchmarks />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </DashboardLayout>
        </ErrorBoundary>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
