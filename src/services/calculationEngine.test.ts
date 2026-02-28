import { describe, it, expect } from 'vitest'
import { calculateScenarioResults } from './calculationEngine'
import type { BenefitData, ScenarioAdjustment } from '../types'

describe('CalculationEngine', () => {
  const mockBaseData: BenefitData[] = [
    {
      id: '1',
      organization_id: 'org-1',
      year: 2024,
      plan_name: 'PPO',
      plan_type: 'PPO',
      employee_count: 10, // Reduced for easier mental math
      employer_premium: 1000,
      employee_premium: 200,
      deductible: 1000,
      out_of_pocket_max: 3000,
      created_at: ''
    }
  ]

  it('calculates baseline costs correctly', () => {
    const results = calculateScenarioResults(mockBaseData, [])

    // 10 * (1000 + 200) = 12,000
    expect(results.projected_total_cost).toBe(12000)
    expect(results.projected_employer_cost).toBe(10000)
    expect(results.projected_employee_cost).toBe(2000)
    expect(results.delta_from_baseline).toBe(0)
  })

  it('calculates premium change correctly', () => {
    const adjustments: ScenarioAdjustment[] = [
      { type: 'premium_change', value: 0.1 } // 10% increase
    ]
    const results = calculateScenarioResults(mockBaseData, adjustments)

    // 12,000 * 1.1 = 13,200
    expect(results.projected_total_cost).toBe(13200)
    expect(results.delta_from_baseline).toBe(1200)
  })

  it('calculates deductible change impact correctly', () => {
    const adjustments: ScenarioAdjustment[] = [
      { type: 'deductible_change', value: 0.5 } // 50% increase (10% premium decrease by heuristic: 50% * -0.2 = -10%)
    ]
    const results = calculateScenarioResults(mockBaseData, adjustments)

    // 12,000 * 0.9 = 10,800
    expect(results.projected_total_cost).toBe(10800)
    expect(results.delta_from_baseline).toBe(-1200)
  })
})
