import { useState, useEffect, useCallback } from 'react'
import { listTasks } from '../api/tasks'

/**
 * Custom hook for managing task list with filtering, sorting, and loading state
 * Reduces code duplication in TaskListView and other components
 */
export function useTaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sort, setSort] = useState({ field: 'dueDate', dir: 'asc' })
  const [filter, setFilter] = useState({ status: 'all', search: '' })

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await listTasks()
      const arr = Array.isArray(data) ? data : []
      setTasks(arr)
      return arr
    } catch (e) {
      const errorMsg = 'Failed to load tasks'
      setError(errorMsg)
      console.error('Load tasks error:', e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const toggleSort = useCallback((field) => {
    setSort(prev => 
      prev.field === field 
        ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' } 
        : { field, dir: 'asc' }
    )
  }, [])

  const updateFilter = useCallback((updates) => {
    setFilter(prev => ({ ...prev, ...updates }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilter({ status: 'all', search: '' })
  }, [])

  return {
    tasks,
    loading,
    error,
    sort,
    filter,
    setTasks,
    loadTasks,
    toggleSort,
    updateFilter,
    clearFilters,
    setError
  }
}
