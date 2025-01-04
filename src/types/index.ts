// Types for warehouse and script management
export interface Script {
  id: string
  name: string
  status: 'active' | 'paused'
  cronExpression?: string
}

export interface Warehouse {
  id: string
  name: string
  scripts: Script[]
}

export interface ApiError {
  message: string
  status: number
}
