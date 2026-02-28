export type UserRole = 'platform_admin' | 'employer_admin' | 'employer_user' | 'broker_advisor'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  organization_id: string | null
  created_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface BenefitData {
  id: string
  organization_id: string
  year: number
  plan_name: string
  plan_type: 'HMO' | 'PPO' | 'HDHP' | 'Other'
  employee_count: number
  employer_premium: number
  employee_premium: number
  deductible: number
  out_of_pocket_max: number
  created_at: string
}

export interface FinancialData {
  id: string
  organization_id: string
  period_start: string
  period_end: string
  total_spend: number
  medical_spend: number
  pharmacy_spend: number
  administrative_fees: number
  created_at: string
}

export interface InvoiceData {
  id: string
  organization_id: string
  carrier_name: string
  invoice_date: string
  amount_due: number
  billing_period: string
  status: 'pending' | 'processed' | 'error'
  file_url: string | null
  created_at: string
}

export interface Scenario {
  id: string
  organization_id: string
  name: string
  description: string | null
  base_data_id: string
  adjustments: ScenarioAdjustment[]
  results: ScenarioResults
  created_at: string
}

export interface ScenarioAdjustment {
  type: 'premium_change' | 'deductible_change' | 'enrollment_shift'
  value: number
  target_plan_id?: string
}

export interface ScenarioResults {
  projected_total_cost: number
  projected_employer_cost: number
  projected_employee_cost: number
  delta_from_baseline: number
}
