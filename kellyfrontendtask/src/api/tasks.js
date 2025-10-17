import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../constants'

// Support test environment where axios is module-mocked and create() may be undefined
const baseURL = API_BASE_URL
const client = typeof axios.create === 'function' ? axios.create({ baseURL }) : axios

// Add response interceptor for consistent error handling
if (client.interceptors) {
  client.interceptors.response.use(
    response => response,
    error => {
      // Enhanced error object with user-friendly messages
      const enhancedError = error

      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const data = error.response.data

        // Extract user-friendly message
        if (typeof data === 'object' && data.message) {
          enhancedError.userMessage = data.message
        } else if (typeof data === 'string') {
          enhancedError.userMessage = data
        } else {
          enhancedError.userMessage = `Server error (${status})`
        }

        enhancedError.statusCode = status

        // Log detailed error info in development
        if (import.meta.env.DEV) {
          console.error('[API Error]', {
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            status,
            data,
            message: error.message
          })
        }
      } else if (error.request) {
        // Request made but no response received
        enhancedError.userMessage = 'Network error - please check your connection'
        if (import.meta.env.DEV) {
          console.error('[API Error] No response received:', {
            url: error.config?.url,
            method: error.config?.method?.toUpperCase()
          })
        }
      } else {
        // Error setting up the request
        enhancedError.userMessage = 'Request failed - please try again'
        if (import.meta.env.DEV) {
          console.error('[API Error] Request setup failed:', error.message)
        }
      }

      return Promise.reject(enhancedError)
    }
  )
}

// ---- Core CRUD ----
export async function listTasks() {
  const { data } = await client.get('/tasks')
  // Normalization: backend currently returns a simple array. If future pagination wraps it,
  // accept objects like { content: [...], items: [...], data: [...] }.
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.content)) return data.content
  if (data && Array.isArray(data.items)) return data.items
  if (data && Array.isArray(data.data)) return data.data
  return []
}

export async function getTask(id) {
  const { data } = await client.get(`/tasks/${id}`)
  return data
}

export async function createTask(task) {
  const { data } = await client.post('/tasks', task)
  return data
}

export async function updateTask(task) {
  const { id, ...rest } = task
  const { data } = await client.put(`/tasks/${id}`, rest)
  return data
}

export async function deleteTask(id) {
  await client.delete(`/tasks/${id}`)
}

// Align with backend: PUT /tasks/{id}/status?status=VALUE
export async function updateStatus(id, status) {
  const { data } = await client.put(`/tasks/${id}/status`, null, { params: { status } })
  return data
}

// ---- Extended Queries ----
export async function listStatuses() {
  const { data } = await client.get('/tasks/statuses')
  return data
}

// Search tasks using backend endpoint when possible; fallback to in-memory filter.
// Backend: GET /tasks/search?title=&status=&dueDate=YYYY-MM-DD (all params optional)
export async function searchTasks(filters = {}) {
  const { title = '', dueDate = '', status = '' } = filters
  const hasFilters = !!(title || dueDate || status)
  // Try server search first when any filter supplied (or even none, acts like list)
  try {
    const params = {}
    if (title) params.title = title
    if (status) params.status = status
    if (dueDate) params.dueDate = dueDate
    const { data } = await client.get('/tasks/search', { params })
    return data
  } catch (err) {
    // Fallback (silently) to client-side filtering of full list
    console.warn('[tasks.searchTasks] backend search failed, falling back to client filtering', err?.message)
    const all = await listTasks()
    return all.filter(t => {
      if (title && !t.title?.toLowerCase().includes(title.toLowerCase())) return false
      if (status && t.status !== status) return false
      if (dueDate) {
        const d = (t.dueDate || '').slice(0,10)
        if (d !== dueDate) return false
      }
      return true
    })
  }
}

