// src/api/scriptApi.ts
import { Job } from '../types'

const API_BASE_URL = '/api'

export async function fetchJobs(): Promise<Job[]> {
  const response = await fetch(`${API_BASE_URL}/jobs`)

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.statusText}`)
  }

  return response.json()
}

export async function toggleJob(jobId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/toggle`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`Failed to toggle job: ${response.statusText}`)
  }
}

export async function runNow(scriptId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/run_now/${scriptId}`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`Failed to run script: ${response.statusText}`)
  }
}

export async function updateJobSchedule(
  jobId: number,
  cronExpression: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cron_expression: cronExpression }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update schedule: ${response.statusText}`)
  }
}

export interface LogEntry {
  timestamp: string
  level: string
  message: string
}

export interface LogOptions {
  hours?: number
  level?: string
}

export async function fetchScriptLogs(
  scriptId: string,
  options: LogOptions = {}
): Promise<LogEntry[]> {
  const params = new URLSearchParams()
  if (options.hours) params.append('hours', options.hours.toString())
  if (options.level) params.append('level', options.level)

  const response = await fetch(
    `${API_BASE_URL}/scripts/${scriptId}/logs?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.statusText}`)
  }

  return response.json()
}
