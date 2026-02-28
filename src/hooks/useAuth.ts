import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { UserProfile, UserRole } from '../types'
import { useAppStore } from '../store/useAppStore'
import { logger } from '../utils/logger'

export const useAuth = () => {
  const { user, setUser, setOrganization, setLoading } = useAppStore()
  const [isInitializing, setIsInitializing] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*, organizations(*)')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (profile) {
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role as UserRole,
          organization_id: profile.organization_id,
          created_at: profile.created_at
        }
        setUser(userProfile)
        if (profile.organizations) {
          setOrganization(profile.organizations)
        }
        logger.info('User profile and organization loaded', { userId, orgId: profile.organization_id })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('Error fetching profile', { error: errorMessage, userId })
    } finally {
      setLoading(false)
      setIsInitializing(false)
    }
  }, [setLoading, setUser, setOrganization])

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        logger.error('Error getting session', { error: error.message })
        setIsInitializing(false)
        return
      }

      if (session) {
        fetchProfile(session.user.id)
      } else {
        setIsInitializing(false)
      }
    }).catch(err => {
      logger.error('Unexpected error during session initialization', { error: err })
      setIsInitializing(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setOrganization(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile, setUser, setOrganization])

  return { user, isInitializing }
}
