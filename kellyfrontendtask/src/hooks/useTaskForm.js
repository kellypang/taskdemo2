import { useState, useCallback } from 'react'
import { validateTask } from '../utils/validation'

/**
 * Custom hook for managing task form state and validation
 * Reduces code duplication across CreateTask, TaskDetails, and other forms
 */
export function useTaskForm(initialTask = {}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'NEW',
    dueDate: '',
    ...initialTask
  })
  
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = useCallback((field, value) => {
    // Truncate description to 500 characters
    if (field === 'description' && value.length > 500) {
      value = value.substring(0, 500)
    }
    
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }, [errors])

  const handleDateTimeChange = useCallback((value) => {
    handleChange('dueDate', value ? new Date(value).toISOString() : '')
  }, [handleChange])

  const validate = useCallback(() => {
    const validationErrors = validateTask(formData)
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }, [formData])

  const resetForm = useCallback((newData = {}) => {
    setFormData({
      title: '',
      description: '',
      status: 'NEW',
      dueDate: '',
      ...newData
    })
    setErrors({})
    setSubmitting(false)
  }, [])

  const setError = useCallback((field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  return {
    formData,
    errors,
    submitting,
    setSubmitting,
    handleChange,
    handleDateTimeChange,
    validate,
    resetForm,
    setError,
    clearErrors,
    setFormData
  }
}
