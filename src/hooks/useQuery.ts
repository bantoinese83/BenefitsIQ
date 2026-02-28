import { useState, useEffect, useCallback } from 'react'
import { logger } from '../utils/logger'
import { toast } from 'sonner'

interface QueryResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * High-impact, low-effort query abstraction.
 * Centralizes loading states, error reporting, and logging.
 * Decouples components from specific fetching implementation.
 */
export function useQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  dependencies: any[] = []
): QueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: result, error: fetchError } = await queryFn()
      if (fetchError) throw fetchError
      setData(result)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch data'
      setError(err as Error)
      logger.error('Query execution failed', { error: errorMessage })
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [queryFn])

  useEffect(() => {
    fetchData()
  }, dependencies)

  return { data, loading, error, refetch: fetchData }
}
