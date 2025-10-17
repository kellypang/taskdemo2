import { useState, useEffect, useCallback } from 'react'
import { getTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask, updateStatus as apiUpdateStatus } from '../api/tasks'

/**
 * Custom hook for managing a single task's details, editing, and actions
 * Reduces code duplication in TaskDetails page
 */
export function useTaskDetails(taskId) {
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const loadTask = useCallback(async () => {
    if (!taskId) return null
    
    setLoading(true)
    setError(null)
    
    try {
      const taskData = await getTask(taskId)
      setTask(taskData)
      return taskData
    } catch (e) {
      console.error('Load task error:', e)
      const errorMsg = e.response?.status === 404 
        ? 'Task not found'
        : 'Failed to load task details'
      setError(errorMsg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    loadTask()
  }, [loadTask])

  const updateTask = useCallback(async (updates) => {
    try {
      const updatedTask = await apiUpdateTask(taskId, updates)
      setTask(updatedTask)
      setMessage('Task updated successfully!')
      setTimeout(() => setMessage(''), 3000)
      return updatedTask
    } catch (e) {
      console.error('Update task error:', e)
      throw e
    }
  }, [taskId])

  const updateStatus = useCallback(async (newStatus) => {
    try {
      const updatedTask = await apiUpdateStatus(taskId, newStatus)
      setTask(updatedTask)
      setMessage(`Status updated to ${newStatus}`)
      setTimeout(() => setMessage(''), 3000)
      return updatedTask
    } catch (e) {
      console.error('Status update error:', e)
      setError('Failed to update status')
      throw e
    }
  }, [taskId])

  const deleteTask = useCallback(async () => {
    try {
      await apiDeleteTask(taskId)
      return true
    } catch (e) {
      console.error('Delete task error:', e)
      setError('Failed to delete task')
      throw e
    }
  }, [taskId])

  const showMessage = useCallback((msg, duration = 3000) => {
    setMessage(msg)
    if (duration > 0) {
      setTimeout(() => setMessage(''), duration)
    }
  }, [])

  const clearMessage = useCallback(() => {
    setMessage('')
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    task,
    loading,
    error,
    message,
    isEditing,
    setIsEditing,
    loadTask,
    updateTask,
    updateStatus,
    deleteTask,
    showMessage,
    clearMessage,
    clearError,
    setError
  }
}
