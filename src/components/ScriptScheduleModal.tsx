import React, { useState } from 'react'
import { Script } from '../types'

interface Props {
  script: Script
  onClose: () => void
  onUpdate: (scriptId: string, cronExpression: string) => Promise<void>
}

const commonSchedules = [
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every Sunday at 2am', value: '0 2 * * 0' },
  { label: 'Every Monday at 9am', value: '0 9 * * 1' },
]

const validateCronExpression = (cron: string): boolean => {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return false

  // Basic pattern validation for each part
  const patterns = [
    /^(\*|([0-9]|[1-5][0-9])(\-[0-9]|[1-5][0-9])?(\,[0-9]|[1-5][0-9])*)$/, // minute
    /^(\*|([0-9]|1[0-9]|2[0-3])(\-([0-9]|1[0-9]|2[0-3]))?(\,([0-9]|1[0-9]|2[0-3]))*)$/, // hour
    /^(\*|([1-9]|[12][0-9]|3[01])(\-([1-9]|[12][0-9]|3[01]))?(\,([1-9]|[12][0-9]|3[01]))*)$/, // day
    /^(\*|([1-9]|1[0-2])(\-([1-9]|1[0-2]))?(\,([1-9]|1[0-2]))*)$/, // month
    /^(\*|[0-6](\-[0-6])?(\,[0-6])*)$/, // day of week
  ]

  return parts.every((part, i) => patterns[i].test(part))
}

export function ScriptScheduleModal({ script, onClose, onUpdate }: Props) {
  const [cronExpression, setCronExpression] = useState(
    script.cronExpression || ''
  )
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(true)

  const handleExpressionChange = (value: string) => {
    setCronExpression(value)
    const valid = validateCronExpression(value)
    setIsValid(valid)
    if (!valid) {
      setError(
        'Invalid cron format. Please use the format: minute hour day month day_of_week'
      )
    } else {
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) {
      setError('Please fix the cron expression format before saving.')
      return
    }
    try {
      await onUpdate(script.id, cronExpression)
      onClose()
    } catch (err) {
      setError('Failed to update schedule. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Update Schedule - {script.name}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Common Schedules
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            onChange={(e) => handleExpressionChange(e.target.value)}
            value={cronExpression}
          >
            <option value="">Select a schedule...</option>
            {commonSchedules.map((schedule) => (
              <option key={schedule.value} value={schedule.value}>
                {schedule.label}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cron Expression
            </label>
            <input
              type="text"
              value={cronExpression}
              onChange={(e) => handleExpressionChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                isValid ? 'border-gray-300' : 'border-red-500'
              }`}
              placeholder="0 0 * * *"
            />
            <p className="mt-1 text-sm text-gray-500">
              Format: minute hour day month day_of_week
            </p>
            {!isValid && (
              <p className="mt-1 text-sm text-gray-500">
                Example values:
                <br />
                - Minutes: 0-59
                <br />
                - Hours: 0-23
                <br />
                - Day: 1-31
                <br />
                - Month: 1-12
                <br />- Day of week: 0-6 (Sunday=0)
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`px-4 py-2 text-white rounded-md ${
                isValid
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
