// src/components/Toast/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast, ToastType } from './types'

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void
  removeToast: (id: string) => void
  toasts: Toast[]
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString()
    setToasts((currentToasts) => [...currentToasts, { id, message, type }])

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      )
    }, 3000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    )
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
