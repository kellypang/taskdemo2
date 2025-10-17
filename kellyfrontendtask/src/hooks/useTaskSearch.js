import { useState, useCallback } from 'react'
import { searchTasks as apiSearchTasks } from '../api/tasks'
import { getDueDate } from '../models/task'

/**
 * Custom hook for managing task search with filters and results
 * Reduces code duplication in SearchTasks page
 */
export function useTaskSearch() {
  const [filters, setFilters] = useState({ 
    title: '', 
    dueDate: '', 
    status: '',
    dueDateRange: 'any' // any, today, this_week, overdue, specific
  })
  
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const [sort, setSort] = useState({ field: 'dueDate', dir: 'asc' })

  const updateFilter = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    
    // Clear specific date when using date range filter
    if (field === 'dueDateRange' && value !== 'specific') {
      setFilters(prev => ({ ...prev, dueDate: '' }))
    }
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({ 
      title: '', 
      dueDate: '', 
      status: '',
      dueDateRange: 'any'
    })
    setResults([])
    setSearched(false)
    setError(null)
    setMessage('')
  }, [])

  const applyDateRangeFilter = useCallback((data) => {
    if (filters.dueDateRange === 'today') {
      const today = new Date().toISOString().split('T')[0]
      return data.filter(task => {
        const taskDate = getDueDate(task)
        return taskDate && taskDate.toISOString().split('T')[0] === today
      })
    } else if (filters.dueDateRange === 'this_week') {
      const now = new Date()
      const nextWeek = new Date(now)
      nextWeek.setDate(now.getDate() + 7)
      return data.filter(task => {
        const taskDate = getDueDate(task)
        return taskDate && taskDate >= now && taskDate <= nextWeek
      })
    } else if (filters.dueDateRange === 'overdue') {
      const now = new Date()
      return data.filter(task => {
        const taskDate = getDueDate(task)
        return taskDate && taskDate < now && task.status !== 'COMPLETED'
      })
    }
    return data
  }, [filters.dueDateRange])

  const search = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Prepare search filters
      const searchFilters = {
        title: filters.title.trim(),
        status: filters.status
      }
      
      // Handle specific date filtering
      if (filters.dueDateRange === 'specific' && filters.dueDate) {
        searchFilters.dueDate = filters.dueDate
      }
      
      let data = await apiSearchTasks(searchFilters)
      
      // Apply client-side filtering for special date ranges
      data = applyDateRangeFilter(data)
      
      setResults(data)
      setSearched(true)
      setMessage(`${data.length} result${data.length === 1 ? '' : 's'} found`)
      
      return data
    } catch (err) {
      console.error('Search failed', err)
      setError('Search failed. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [filters, applyDateRangeFilter])

  const toggleSort = useCallback((field) => {
    setSort(prev => 
      prev.field === field 
        ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' } 
        : { field, dir: 'asc' }
    )
  }, [])

  return {
    filters,
    results,
    searched,
    loading,
    error,
    message,
    sort,
    updateFilter,
    clearFilters,
    search,
    toggleSort,
    setError,
    setMessage
  }
}
