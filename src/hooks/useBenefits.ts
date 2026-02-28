import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAppStore } from '../store/useAppStore'
import type { BenefitData } from '../types'

export const useBenefits = () => {
    const { organization, setBenefitData, setLoading, setError } = useAppStore()
    const [isFetched, setIsFetched] = useState(false)

    const fetchBenefits = useCallback(async () => {
        if (!organization?.id) return

        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('benefits_data')
                .select('*')
                .eq('organization_id', organization.id)
                .order('year', { ascending: false })

            if (error) throw error

            if (data) {
                setBenefitData(data as BenefitData[])
                setIsFetched(true)
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to fetch benefits data'
            setError(message)
        } finally {
            setLoading(false)
        }
    }, [organization?.id, setBenefitData, setLoading, setError])

    useEffect(() => {
        if (organization?.id && !isFetched) {
            fetchBenefits()
        }
    }, [organization?.id, isFetched, fetchBenefits])

    return { fetchBenefits }
}
