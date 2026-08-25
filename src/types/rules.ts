export type RuleType = 'PRIVACY' | 'ABOUT' | 'TERMS'

export interface RuleData {
  _id?: string
  type?: string
  content: string
  createdAt?: string
  updatedAt?: string
}

export interface RuleResponse {
  success: boolean
  message: string
  data: RuleData | null
}

export interface CreateOrUpdateRulePayload {
  type: RuleType
  content: string
}
