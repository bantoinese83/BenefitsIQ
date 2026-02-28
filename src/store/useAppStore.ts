import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, Organization, BenefitData, FinancialData } from '../types'

interface AppState {
  user: UserProfile | null
  organization: Organization | null
  benefitData: BenefitData[]
  financialData: FinancialData[]
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: UserProfile | null) => void
  setOrganization: (org: Organization | null) => void
  setBenefitData: (data: BenefitData[]) => void
  setFinancialData: (data: FinancialData[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      benefitData: [],
      financialData: [],
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setOrganization: (organization) => set({ organization }),
      setBenefitData: (benefitData) => set({ benefitData }),
      setFinancialData: (financialData) => set({ financialData }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'benefits-iq-storage',
    }
  )
)
