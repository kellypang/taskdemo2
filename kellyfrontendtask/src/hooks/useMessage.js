import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for managing temporary messages (success, error, info)
 * Reduces code duplication across components
 */
export function useMessage(defaultDuration = 3000) {
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info') // 'success', 'error', 'info', 'warning'

  const showMessage = useCallback((msg, msgType = 'info', duration = defaultDuration) => {
    setMessage(msg)
    setType(msgType)
    
    if (duration > 0) {
      setTimeout(() => {
        setMessage('')
      }, duration)
    }
  }, [defaultDuration])

  const clearMessage = useCallback(() => {
    setMessage('')
  }, [])

  return {
    message,
    type,
    showMessage,
    clearMessage
  }
}
