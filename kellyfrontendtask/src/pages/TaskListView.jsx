import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listTasks, deleteTask, updateStatus } from '../api/tasks'
import { getDueDate, STATUSES } from '../models/task'
import { isOverdue } from '../utils/taskUtils'
import TaskTable from '../components/shared/TaskTable'
import { useTaskStats } from '../contexts/TaskStatsContext'

export default function TaskListView() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const [sort, setSort] = useState({ field: 'dueDate', dir: 'asc' })
  const [filter, setFilter] = useState({ status: 'all', search: '' })
  const [statusUpdating, setStatusUpdating] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { setTaskStats } = useTaskStats()

  async function loadTasks() {
    setLoading(true)
    setError(null)
    try {
      const data = await listTasks()
      const arr = Array.isArray(data) ? data : []
      setTasks(arr)
    } catch (e) {
      setError('Failed to load tasks')
      console.error('Load tasks error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  function toggleSort(field) {
    setSort(prev => 
      prev.field === field 
        ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' } 
        : { field, dir: 'asc' }
    )
  }

  function getSortedAndFilteredTasks() {
    let filteredTasks = [...tasks]
    
    // Apply status filter
    if (filter.status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filter.status)
    }
    
    // Apply search filter
    if (filter.search.trim()) {
      const searchTerm = filter.search.toLowerCase().trim()
      filteredTasks = filteredTasks.filter(task => 
        task.title?.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm)
      )
    }
    
    // Apply sorting
    const { field, dir } = sort
    filteredTasks.sort((a, b) => {
      let av = a[field]
      let bv = b[field]
      
      if (field === 'dueDate') {
        av = getDueDate(a)?.getTime() || 0
        bv = getDueDate(b)?.getTime() || 0
      } else if (field === 'tasknum') {
        // Handle tasknum sorting with fallback to id
        av = a.tasknum || a.id
        bv = b.tasknum || b.id
      }
      
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      
      if (av < bv) return dir === 'asc' ? -1 : 1
      if (av > bv) return dir === 'asc' ? 1 : -1
      return 0
    })
    
    return filteredTasks
  }

  async function handleDelete(task) {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return
    
    try {
      await deleteTask(task.id)
      setMessage(`Task "${task.title}" deleted successfully`)
      setTimeout(() => setMessage(''), 3000)
      await loadTasks()
    } catch (e) {
      setError(`Failed to delete task: ${e.message}`)
      console.error('Delete error:', e)
    }
  }

  async function handleStatusChange(task, newStatus) {
    setStatusUpdating(task.id)
    try {
      await updateStatus(task.id, newStatus)
      setMessage(`Task status updated to ${newStatus}`)
      setTimeout(() => setMessage(''), 3000)
      await loadTasks()
    } catch (e) {
      setError(`Failed to update status: ${e.message}`)
      console.error('Status update error:', e)
    } finally {
      setStatusUpdating(null)
    }
  }

  const filteredTasks = getSortedAndFilteredTasks()
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredTasks.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex)
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filter.status, filter.search, pageSize])
  
  // Update task stats in context whenever tasks change
  useEffect(() => {
    const stats = {
      total: tasks.length,
      new: tasks.filter(t => t.status === 'NEW').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      completed: tasks.filter(t => t.status === 'COMPLETED').length,
      overdue: tasks.filter(t => isOverdue(t)).length
    }
    setTaskStats(stats)
  }, [tasks, setTaskStats])

  return (
    <div className="dashboard">
      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <label>Filter by Status:</label>
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            {STATUSES.map(status => (
              <option key={status} value={status}>{status.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <Link to="/tasks/search" className="btn btn-secondary">Advanced Search</Link>
      </div>

      {/* Messages */}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading State */}
      {loading && <div className="loading">Loading tasks...</div>}

      {/* Task Table */}
      {!loading && (
        <div className="task-table-container">
          <div className="table-header">
            <h3>All Tasks ({filteredTasks.length})</h3>
          </div>
          
          {filteredTasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks found.</p>
              <Link to="/tasks/new" className="btn btn-primary">Create your first task</Link>
            </div>
          ) : (
            <>
              <TaskTable
                tasks={paginatedTasks}
                sort={sort}
                onToggleSort={toggleSort}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                statusUpdating={statusUpdating}
                showActions={true}
              />
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredTasks.length)} of {filteredTasks.length} tasks
                  </div>
                  
                  <div className="pagination-controls">
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      First
                    </button>
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Last
                    </button>
                  </div>
                  
                  <div className="page-size-selector">
                    <label>Per page:</label>
                    <select 
                      value={pageSize} 
                      onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
