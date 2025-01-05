// src/types/index.ts
export interface Script {
  id: string
  name: string
  status: 'active' | 'paused'
  cronExpression?: string
  jobId?: string // This is job_id from Job interface
  numericJobId?: number // This is id from Job interface
}

export interface Warehouse {
  id: string
  name: string
  scripts: Script[]
}

export interface Job {
  id: number
  job_id: string
  script_id: number
  cron_expression: string
  enabled: boolean
  created_at: string
}

export interface ApiError {
  message: string
  status: number
}
