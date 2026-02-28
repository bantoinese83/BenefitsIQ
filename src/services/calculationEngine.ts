import { useMemo } from 'react'
import type { BenefitData, ScenarioAdjustment, ScenarioResults } from '../types'

/**
 * Deterministic calculation logic for benefit scenarios.
 * Extracted into a pure function for better testability and maintainability.
 */
export const calculateScenarioResults = (
  baseData: BenefitData[],
  adjustments: ScenarioAdjustment[]
): ScenarioResults => {
  // 1. Calculate Baseline and Projections in a single pass for peak O(N) efficiency
  const results = baseData.reduce((acc, plan) => {
    // Baseline calculations
    const planBaselineTotal = (Number(plan.employer_premium) + Number(plan.employee_premium)) * plan.employee_count
    acc.baselineTotal += planBaselineTotal

    // Projected calculations
    let projectedEmployerPremium = Number(plan.employer_premium)
    let projectedEmployeePremium = Number(plan.employee_premium)

    adjustments.forEach(adjustment => {
      const multiplier = adjustment.type === 'premium_change' ? (1 + adjustment.value) :
                         adjustment.type === 'deductible_change' ? (1 + (adjustment.value * -0.2)) : 1
      
      projectedEmployerPremium *= multiplier
      projectedEmployeePremium *= multiplier
    })

    acc.projectedEmployerCost += projectedEmployerPremium * plan.employee_count
    acc.projectedEmployeeCost += projectedEmployeePremium * plan.employee_count
    
    return acc
  }, { baselineTotal: 0, projectedEmployerCost: 0, projectedEmployeeCost: 0 })

  const projectedTotalCost = results.projectedEmployerCost + results.projectedEmployeeCost

  return {
    projected_total_cost: Math.round(projectedTotalCost),
    projected_employer_cost: Math.round(results.projectedEmployerCost),
    projected_employee_cost: Math.round(results.projectedEmployeeCost),
    delta_from_baseline: Math.round(projectedTotalCost - results.baselineTotal),
  }
}

/**
 * Performance-optimized hook for scenario calculations.
 * Memoizes results to prevent re-calculations during component re-renders.
 */
export const useScenarioCalculation = (
  baseData: BenefitData[],
  adjustments: ScenarioAdjustment[]
) => {
  return useMemo(
    () => calculateScenarioResults(baseData, adjustments),
    [baseData, adjustments]
  )
}
