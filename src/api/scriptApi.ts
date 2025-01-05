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
