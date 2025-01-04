import { useToast } from './ToastContext'
import { XCircle, CheckCircle, Info } from 'lucide-react'
import { ToastType } from './types'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <XCircle className="w-5 h-5" />
      case 'info':
        return <Info className="w-5 h-5" />
    }
  }

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200'
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${getToastStyles(
            toast.type
          )}`}
          onClick={() => removeToast(toast.id)}
          role="alert"
        >
          {getToastIcon(toast.type)}
          <p>{toast.message}</p>
        </div>
      ))}
    </div>
  )
}
