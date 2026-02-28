import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"
import { Button } from "./common/Button"
import { Card, CardContent } from "./common/Card"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = "/"
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
          <div className="absolute inset-0 bg-rose-500/5 blur-[120px] rounded-full scale-150" />
          
          <Card className="max-w-xl w-full relative z-10 border-rose-500/20 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
                <AlertCircle size={48} />
              </div>
              
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">System Variance Detected</h2>
              <p className="text-slate-400 mb-8 text-lg leading-relaxed font-medium">
                An unexpected technical exception has interrupted the platform session. Our engineering protocols have been notified.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="mb-8 p-4 bg-slate-900 rounded-xl border border-slate-800 text-left overflow-auto max-h-40 scrollbar-hide">
                  <p className="text-rose-400 font-mono text-xs whitespace-pre-wrap">{this.state.error.stack}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="primary"
                  onClick={this.handleReset}
                  className="h-14 bg-rose-600 hover:bg-rose-500 shadow-rose-500/20 border-none"
                  icon={RefreshCcw}
                >
                  Restart Session
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="h-14"
                  icon={Home}
                >
                  Return to Base
                </Button>
              </div>
              
              <p className="mt-10 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                Error Reference: {Math.random().toString(36).substring(7).toUpperCase()}
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
