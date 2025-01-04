// src/App.tsx
import { useState } from 'react'
import { WarehouseSelect } from './components/WarehouseSelect'
import { ScriptList } from './components/ScriptList'
import { ErrorBoundary } from './components/ErrorBoundary'
import { warehouses } from './data/warehouses'
import { Warehouse } from './types'
import { toggleJob, runNow, updateJobSchedule } from './api/scriptApi'
import { Terminal } from 'lucide-react'
import { ToastProvider, ToastContainer, useToast } from './components/Toast'

function AppContent() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  )
  const { addToast } = useToast()

  const handleRunNow = async (scriptId: string) => {
    try {
      const script = selectedWarehouse?.scripts.find((s) => s.id === scriptId)
      addToast(`Starting script: ${script?.name || 'Unknown script'}`, 'info')
      await runNow(scriptId)
      addToast('Script execution started successfully', 'success')
    } catch (err) {
      addToast('Failed to run script. Please try again.', 'error')
    }
  }

  const handleToggle = async (scriptId: string) => {
    try {
      await toggleJob(scriptId)
      if (selectedWarehouse) {
        const script = selectedWarehouse.scripts.find((s) => s.id === scriptId)
        const newStatus: 'active' | 'paused' =
          script?.status === 'active' ? 'paused' : 'active'

        const updatedScripts = selectedWarehouse.scripts.map((s) =>
          s.id === scriptId ? { ...s, status: newStatus } : s
        )
        setSelectedWarehouse({ ...selectedWarehouse, scripts: updatedScripts })
        addToast(
          `Script ${
            newStatus === 'active' ? 'resumed' : 'paused'
          } successfully`,
          'success'
        )
      }
    } catch (err) {
      addToast('Failed to toggle script status. Please try again.', 'error')
    }
  }

  const handleUpdateSchedule = async (
    scriptId: string,
    cronExpression: string
  ) => {
    try {
      await updateJobSchedule(scriptId, cronExpression)
      if (selectedWarehouse) {
        const updatedScripts = selectedWarehouse.scripts.map((script) =>
          script.id === scriptId ? { ...script, cronExpression } : script
        )
        setSelectedWarehouse({ ...selectedWarehouse, scripts: updatedScripts })
      }
      addToast('Schedule updated successfully', 'success')
    } catch (err) {
      addToast('Failed to update schedule. Please try again.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Terminal className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Warehouse Script Manager
          </h1>
        </div>

        <WarehouseSelect
          warehouses={warehouses}
          selectedWarehouse={selectedWarehouse}
          onSelect={setSelectedWarehouse}
        />

        {selectedWarehouse && (
          <ScriptList
            scripts={selectedWarehouse.scripts}
            onRunNow={handleRunNow}
            onToggle={handleToggle}
            onUpdateSchedule={handleUpdateSchedule}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
