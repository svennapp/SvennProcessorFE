import { useState, useEffect } from 'react'
import { Script } from '../types'
import { fetchScriptLogs, LogEntry } from '../api/scriptApi'
import { useToast } from './Toast'
import { Loader2 } from 'lucide-react'

interface Props {
  script: Script
  onClose: () => void
}

export function ScriptLogsModal({ script, onClose }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const { addToast } = useToast()

  // Function to load logs
  const loadLogs = async () => {
    try {
      const fetchedLogs = await fetchScriptLogs(script.id, { hours: 24 })
      setLogs(fetchedLogs)
      setError(null)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch logs'
      setError(message)
      addToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadLogs()
  }, [script.id])

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(loadLogs, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [autoRefresh, script.id])

  const getLogLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return 'text-red-600'
      case 'WARNING':
        return 'text-yellow-600'
      case 'INFO':
        return 'text-blue-600'
      case 'SUCCESS':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Logs - {script.name}</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Auto-refresh</span>
            </label>
            <button
              onClick={loadLogs}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
              title="Refresh logs"
            >
              <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="text-red-600 p-4 text-center">{error}</div>
          ) : logs.length === 0 ? (
            <div className="text-gray-500 p-4 text-center">
              {loading ? 'Loading logs...' : 'No logs found'}
            </div>
          ) : (
            <pre className="bg-gray-100 p-4 rounded-md text-sm font-mono">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </span>{' '}
                  <span
                    className={`font-semibold ${getLogLevelColor(log.level)}`}
                  >
                    [{log.level}]
                  </span>{' '}
                  {log.message}
                </div>
              ))}
            </pre>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
