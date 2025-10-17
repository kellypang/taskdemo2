import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for handling async operations with loading, error, and data states.
 * Provides consistent pattern for data fetching across components.
 *
 * @param {Function} asyncFunction - Async function to execute
 * @param {Array} dependencies - Dependency array for useEffect
 * @param {Object} options - Configuration options
 * @param {boolean} options.immediate - Whether to execute immediately (default: true)
 * @param {Function} options.onSuccess - Callback on successful completion
 * @param {Function} options.onError - Callback on error
 * @returns {Object} State object with data, loading, error, and execute function
 */
export function useAsync(asyncFunction, dependencies = [], options = {}) {
  const {
    immediate = true,
    onSuccess = null,
    onError = null
  } = options

  const [state, setState] = useState({
    data: null,
    loading: immediate,
    error: null
  })

  const execute = useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const data = await asyncFunction(...args)
      setState({ data, loading: false, error: null })
      if (onSuccess) onSuccess(data)
      return data
    } catch (error) {
      setState({ data: null, loading: false, error })
      if (onError) onError(error)
      throw error
    }
  }, [asyncFunction, onSuccess, onError])

  useEffect(() => {
    if (immediate) {
      let mounted = true
      
      execute().catch(err => {
        // Error already handled in execute, but prevent unhandled rejection
        if (!mounted) return
      })

      return () => {
        mounted = false
      }
    }
  }, dependencies)

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, loading: false, error: null })
  }
}

/**
 * Hook for data fetching that automatically retries on failure.
 *
 * @param {Function} asyncFunction - Async function to execute
 * @param {Array} dependencies - Dependency array
 * @param {Object} options - Configuration options
 * @param {number} options.retries - Number of retries (default: 0)
 * @param {number} options.retryDelay - Delay between retries in ms (default: 1000)
 * @returns {Object} State object
 */
export function useAsyncWithRetry(asyncFunction, dependencies = [], options = {}) {
  const {
    retries = 0,
    retryDelay = 1000,
    ...asyncOptions
  } = options

  const [retryCount, setRetryCount] = useState(0)

  const wrappedFunction = useCallback(async (...args) => {
    let lastError
    for (let i = 0; i <= retries; i++) {
      try {
        return await asyncFunction(...args)
      } catch (error) {
        lastError = error
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          setRetryCount(i + 1)
        }
      }
    }
    throw lastError
  }, [asyncFunction, retries, retryDelay])

  const result = useAsync(wrappedFunction, dependencies, asyncOptions)

  return {
    ...result,
    retryCount
  }
}

/**
 * Hook for polling data at regular intervals.
 *
 * @param {Function} asyncFunction - Async function to execute
 * @param {number} interval - Polling interval in ms
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether polling is enabled (default: true)
 * @returns {Object} State object with stop and start functions
 */
export function useAsyncPoll(asyncFunction, interval, options = {}) {
  const { enabled = true } = options
  const [isPolling, setIsPolling] = useState(enabled)
  
  const result = useAsync(asyncFunction, [isPolling], {
    immediate: enabled
  })

  useEffect(() => {
    if (!isPolling) return

    const intervalId = setInterval(() => {
      result.execute()
    }, interval)

    return () => clearInterval(intervalId)
  }, [isPolling, interval, result.execute])

  return {
    ...result,
    stop: () => setIsPolling(false),
    start: () => setIsPolling(true),
    isPolling
  }
}
