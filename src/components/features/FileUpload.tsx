import React, { useState, useRef } from 'react'
import { Upload, X, File, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { toast } from 'sonner'

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  allowedExtensions?: string[]
  maxSizeMB?: number
}

export const FileUpload = ({
  onUpload,
  allowedExtensions = ['.csv', '.xlsx', '.pdf'],
  maxSizeMB = 10
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validation
    const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
    if (!allowedExtensions.includes(extension)) {
      toast.error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`)
      return
    }

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Max size: ${maxSizeMB}MB`)
      return
    }

    setFile(selectedFile)
    setStatus('idle')
  }

  const handleUpload = async () => {
    if (!file) return

    setStatus('uploading')
    try {
      await onUpload(file)
      setStatus('success')
      toast.success('Invoice uploaded and processed successfully')
    } catch {
      setStatus('error')
      toast.error('Failed to upload file. Please try again.')
    }
  }

  return (
    <Card className="p-1">
      <div className="p-6">
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer group"
          >
            <div className="p-5 bg-slate-800/50 rounded-3xl text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-400/10 mb-6 transition-all duration-300 transform group-hover:scale-110">
              <Upload size={40} />
            </div>
            <p className="font-bold text-slate-200 text-lg">Drop your invoice here</p>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Supports <span className="text-slate-400">{allowedExtensions.join(', ')}</span> up to {maxSizeMB}MB
            </p>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={allowedExtensions.join(',')}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-5 bg-slate-950/50 rounded-2xl border border-slate-800/50 group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                  <File size={28} />
                </div>
                <div>
                  <p className="font-bold text-slate-100 truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              {status === 'idle' && (
                <button
                  onClick={() => setFile(null)}
                  className="p-2 hover:bg-rose-500/10 rounded-xl transition-all text-slate-500 hover:text-rose-400"
                >
                  <X size={20} />
                </button>
              )}
              {status === 'success' && <div className="p-2 bg-emerald-500/10 rounded-full"><CheckCircle2 className="text-emerald-500" size={24} /></div>}
              {status === 'error' && <div className="p-2 bg-rose-500/10 rounded-full"><AlertCircle className="text-destructive" size={24} /></div>}
            </div>

            <div className="space-y-3">
              {status === 'idle' && (
                <Button
                  onClick={handleUpload}
                  className="w-full h-14 text-lg"
                  icon={Upload}
                >
                  Analyze Invoice
                </Button>
              )}

              {status === 'uploading' && (
                <Button
                  disabled
                  variant="secondary"
                  className="w-full h-14 text-lg opacity-80"
                  loading={true}
                >
                  Extraction in Progress...
                </Button>
              )}

              {status === 'success' && (
                <Button
                  onClick={() => { setFile(null); setStatus('idle'); }}
                  variant="outline"
                  className="w-full h-14 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/5"
                  icon={Upload}
                >
                  Upload Another
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
