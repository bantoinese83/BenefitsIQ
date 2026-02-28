import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent } from './Card'

interface Props {
    children: ReactNode
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
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] w-full flex items-center justify-center p-6 bg-slate-950">
                    <Card className="max-w-md w-full border-rose-500/20 bg-rose-500/5 backdrop-blur-xl">
                        <CardContent className="p-8 text-center space-y-6">
                            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                                <AlertCircle size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white tracking-tight">System Encountered a Vector Error</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    The executive intelligence module encountered an unexpected interruption. Data integrity has been preserved.
                                </p>
                            </div>
                            {this.state.error && (
                                <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-left overflow-hidden">
                                    <p className="text-[10px] font-mono text-rose-400 truncate">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="w-full h-12 border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-bold"
                                icon={RotateCcw}
                            >
                                Re-initialize Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}
