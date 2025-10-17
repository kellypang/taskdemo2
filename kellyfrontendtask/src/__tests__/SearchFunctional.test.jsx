import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import SearchTasks from '../pages/SearchTasks'
import * as api from '../api/tasks'

vi.mock('../api/tasks', () => ({ searchTasks: vi.fn() }))

function renderSearchTasks() {
  return render(
    <MemoryRouter>
      <SearchTasks />
    </MemoryRouter>
  )
}

describe('SearchFunctional - Complete Search Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('completes full search workflow with multiple filters', async () => {
    const mockResults = [
      { 
        id: 1, 
        title: 'Important Project', 
        status: 'IN_PROGRESS', 
        dueDate: '2025-12-25T10:00:00' 
      },
      { 
        id: 2, 
        title: 'Important Report', 
        status: 'IN_PROGRESS', 
        dueDate: '2025-12-25T15:00:00' 
      }
    ]
    
    api.searchTasks.mockResolvedValueOnce(mockResults)
    
    renderSearchTasks()
    
    // Verify search page is loaded
    expect(screen.getByRole('heading', { name: /Search Tasks/i })).toBeInTheDocument()
    
    // Apply multiple search filters
    const titleInput = screen.getByPlaceholderText(/title/i)
    const statusSelect = screen.getByLabelText(/status/i)
    const dueDateSelect = screen.getByLabelText(/due date/i)
    
    fireEvent.change(titleInput, { target: { value: 'important' } })
    fireEvent.change(statusSelect, { target: { value: 'IN_PROGRESS' } })
    fireEvent.change(dueDateSelect, { target: { value: 'specific' } })
    
    // Set specific date
    const dateInput = screen.getByLabelText(/due date/i).parentElement.querySelector('input[type="date"]')
    fireEvent.change(dateInput, { target: { value: '2025-12-25' } })
    
    // Execute search
    fireEvent.click(screen.getByRole('button', { name: /search tasks/i }))
    
    // Verify API called with correct filters
    await waitFor(() => {
      expect(api.searchTasks).toHaveBeenCalledWith({
        title: 'important',
        status: 'IN_PROGRESS',
        dueDate: '2025-12-25'
      })
    })
    
    // Verify results are displayed
    expect(await screen.findByText('Important Project')).toBeInTheDocument()
    expect(await screen.findByText('Important Report')).toBeInTheDocument()
    
    // Verify result count
    expect(screen.getByText(/2.*result.*found/i)).toBeInTheDocument()
  })

  it('completes workflow: search → clear filters → search again', async () => {
    // First search
    const firstResults = [{ id: 1, title: 'First Search', status: 'NEW', dueDate: '2025-12-25T10:00:00' }]
    api.searchTasks.mockResolvedValueOnce(firstResults)
    
    renderSearchTasks()
    
    // Perform first search
    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'first' } })
    fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'NEW' } })
    fireEvent.click(screen.getByRole('button', { name: /search tasks/i }))
    
    await waitFor(() => {
      expect(screen.getByText('First Search')).toBeInTheDocument()
    })
    
    // Clear filters
    fireEvent.click(screen.getByText('Clear Filters'))
    
    // Verify filters are cleared
    expect(screen.getByPlaceholderText(/title/i).value).toBe('')
    expect(screen.getByLabelText(/status/i).value).toBe('')
    
    // Second search with different criteria
    const secondResults = [{ id: 2, title: 'Second Search', status: 'COMPLETED', dueDate: '2025-12-26T10:00:00' }]
    api.searchTasks.mockResolvedValueOnce(secondResults)
    
    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'second' } })
    fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'COMPLETED' } })
    fireEvent.click(screen.getByRole('button', { name: /search tasks/i }))
    
    await waitFor(() => {
      expect(api.searchTasks).toHaveBeenCalledWith({
        title: 'second',
        status: 'COMPLETED'
      })
    })
    
    expect(await screen.findByText('Second Search')).toBeInTheDocument()
  })

  it('handles empty search results gracefully', async () => {
    api.searchTasks.mockImplementation(() => Promise.resolve([]))
    
    renderSearchTasks()
    
    // Perform search
    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'nonexistent' } })
    fireEvent.click(screen.getByRole('button', { name: /search tasks/i }))
    
    await waitFor(() => {
      expect(api.searchTasks).toHaveBeenCalled()
    })
    
    // Verify empty state message with longer timeout
    expect(await screen.findByText(/No.*tasks.*match/i, {}, { timeout: 5000 })).toBeInTheDocument()
  })

  it('completes workflow with error recovery', async () => {
    // First search fails
    api.searchTasks.mockRejectedValueOnce(new Error('Network error'))
    
    renderSearchTasks()
    
    // Attempt first search
    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'test' } })
    fireEvent.click(screen.getByRole('button', { name: /search tasks/i }))
    
    // Verify error is displayed (wait for it to appear)
    const errorElement = await screen.findByText(/Search failed/i, {}, { timeout: 5000 })
    expect(errorElement).toBeInTheDocument()
    
    // Retry with successful search - reset mock to return success
    const results = [{ id: 1, title: 'Success', status: 'NEW', dueDate: '2025-12-25T10:00:00' }]
    api.searchTasks.mockImplementation(() => Promise.resolve(results))
    
    fireEvent.click(screen.getByRole('button', { name: /search tasks/i }))
    
    // Verify success on retry
    await waitFor(() => expect(api.searchTasks).toHaveBeenCalledTimes(2))
    
    // Wait for result message first
    expect(await screen.findByText(/1.*result.*found/i, {}, { timeout: 3000 })).toBeInTheDocument()
    const successTask = await screen.findByText('Success')
    expect(successTask).toBeInTheDocument()
  })

  it('allows navigating to task details from search results', async () => {
    const mockResults = [
      { id: 1, title: 'Clickable Task', status: 'NEW', dueDate: '2025-12-25T10:00:00' }
    ]
    
    api.searchTasks.mockResolvedValueOnce(mockResults)
    
    renderSearchTasks()
    
    // Perform search
    fireEvent.click(screen.getByRole('button', { name: /search tasks/i }))
    
    // Wait for API call and check what was called with
    await waitFor(() => {
      expect(api.searchTasks).toHaveBeenCalledWith({
        title: '',
        status: ''
      })
    })
    
    // Wait for the result count message which appears when results are loaded
    expect(await screen.findByText(/1.*result.*found/i, {}, { timeout: 3000 })).toBeInTheDocument()
    
    // Now check for the task title (wait for it)
    const taskTitle = await screen.findByText('Clickable Task')
    expect(taskTitle).toBeInTheDocument()
    
    // Verify task is a link to details page
    const taskLink = screen.getByText('Clickable Task').closest('a')
    expect(taskLink).toHaveAttribute('href', '/tasks/1')
  })
})
