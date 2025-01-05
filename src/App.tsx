// src/App.tsx
import { useState, useEffect } from 'react'
import { WarehouseSelect } from './components/WarehouseSelect'
import { ScriptList } from './components/ScriptList'
import { ErrorBoundary } from './components/ErrorBoundary'
import { warehouses } from './data/warehouses'
import { Warehouse, Script, Job } from './types'
import {
  toggleJob,
  runNow,
  updateJobSchedule,
  fetchJobs,
} from './api/scriptApi'
import { ToastProvider, ToastContainer, useToast } from './components/Toast'

function AppContent() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  )
  const [jobs, setJobs] = useState<Job[]>([])
  const { addToast } = useToast()

  // Fetch jobs when component mounts
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const fetchedJobs = await fetchJobs()
        setJobs(fetchedJobs)
      } catch (err) {
        addToast('Failed to fetch jobs data', 'error')
      }
    }
    loadJobs()
  }, [addToast])

  // Update warehouse scripts with job data when warehouse is selected or jobs change
  useEffect(() => {
    if (selectedWarehouse) {
      const updatedScripts = selectedWarehouse.scripts.map((script) => {
        const job = jobs.find((j) => j.script_id.toString() === script.id)
        if (job) {
          // Ensure status is properly typed as 'active' | 'paused'
          const status: Script['status'] = job.enabled ? 'active' : 'paused'
          return {
            ...script,
            cronExpression: job.cron_expression,
            status,
            jobId: job.job_id,
            numericJobId: job.id,
          }
        }
        return script
      })

      setSelectedWarehouse((prev) => {
        if (!prev) return null
        return {
          ...prev,
          scripts: updatedScripts,
        }
      })
    }
  }, [selectedWarehouse?.id, jobs])

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
      const script = selectedWarehouse?.scripts.find((s) => s.id === scriptId)
      if (!script?.numericJobId) {
        throw new Error('No job ID found for script')
      }

      await toggleJob(script.numericJobId)

      // Refresh jobs after toggle
      const updatedJobs = await fetchJobs()
      setJobs(updatedJobs)

      addToast('Script status updated successfully', 'success')
    } catch (err) {
      addToast('Failed to toggle script status. Please try again.', 'error')
    }
  }

  const handleUpdateSchedule = async (
    scriptId: string,
    cronExpression: string
  ) => {
    try {
      const script = selectedWarehouse?.scripts.find((s) => s.id === scriptId)
      if (!script?.numericJobId) {
        throw new Error('No job ID found for script')
      }

      await updateJobSchedule(script.numericJobId, cronExpression)

      // Refresh jobs after update
      const updatedJobs = await fetchJobs()
      setJobs(updatedJobs)

      addToast('Schedule updated successfully', 'success')
    } catch (err) {
      addToast('Failed to update schedule. Please try again.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            SvennProducts - Script Processors
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
