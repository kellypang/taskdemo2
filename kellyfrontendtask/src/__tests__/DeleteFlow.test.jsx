import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import TaskDetails from '../pages/TaskDetails'
import * as api from '../api/tasks'

// Mock the API
vi.mock('../api/tasks', () => ({
  getTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  updateStatus: vi.fn()
}))

// Mock react-router-dom hooks
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate
  }
})

function renderTaskDetails() {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <TaskDetails />
    </BrowserRouter>
  )
}

describe('DeleteFlow - Complete Task Deletion Workflow', () => {
  const mockTask = {
    id: 1,
    tasknum: 'T001',
    title: 'Task to Delete',
    description: 'This task will be deleted',
    status: 'NEW',
    dueDate: '2025-09-25T10:00:00'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    api.getTask.mockResolvedValue(mockTask)
    
    // Mock window.confirm
    Object.defineProperty(window, 'confirm', {
      value: vi.fn(() => true),
      writable: true,
      configurable: true
    })
  })

  it('completes full delete workflow: confirm → API → navigation', async () => {
    api.deleteTask.mockResolvedValueOnce({ success: true })
    window.confirm.mockReturnValueOnce(true)
    
    renderTaskDetails()
    
    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Task to Delete')).toBeInTheDocument()
    })
    
    // Click delete button
    const deleteButton = screen.getByText('Delete Task')
    fireEvent.click(deleteButton)
    
    // Verify confirmation dialog was shown
    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringMatching(/Are you sure you want to delete.*Task to Delete/i)
    )
    
    // Verify API was called
    await waitFor(() => {
      expect(api.deleteTask).toHaveBeenCalledWith(1)
    })
    
    // Verify navigation to home occurred
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  it('cancels delete workflow when user declines confirmation', async () => {
    window.confirm.mockReturnValueOnce(false)
    
    renderTaskDetails()
    
    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Task to Delete')).toBeInTheDocument()
    })
    
    // Click delete button
    const deleteButton = screen.getByText('Delete Task')
    fireEvent.click(deleteButton)
    
    // Verify confirmation dialog was shown
    expect(window.confirm).toHaveBeenCalled()
    
    // Verify API was NOT called when user cancels
    expect(api.deleteTask).not.toHaveBeenCalled()
    
    // Verify no navigation occurred
    expect(mockNavigate).not.toHaveBeenCalled()
    
    // Verify task is still displayed
    expect(screen.getByText('Task to Delete')).toBeInTheDocument()
  })

  it('handles API errors during delete workflow', async () => {
    api.deleteTask.mockRejectedValueOnce(new Error('Delete failed'))
    window.confirm.mockReturnValueOnce(true)
    
    renderTaskDetails()
    
    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Task to Delete')).toBeInTheDocument()
    })
    
    // Click delete button and confirm
    fireEvent.click(screen.getByText('Delete Task'))
    
    // Wait for API call
    await waitFor(() => {
      expect(api.deleteTask).toHaveBeenCalled()
    })
    
    // Verify error message is displayed (component shows error page on delete failure)
    await waitFor(() => {
      expect(screen.getByText(/Failed to delete task/i)).toBeInTheDocument()
    })
    
    // Verify no navigation occurred on error
    expect(mockNavigate).not.toHaveBeenCalled()
    
    // Verify error page is shown (not the task details)
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
    })
  })

  it('shows appropriate confirmation message with task details', async () => {
    renderTaskDetails()
    
    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Task to Delete')).toBeInTheDocument()
    })
    
    // Click delete button
    fireEvent.click(screen.getByText('Delete Task'))
    
    // Verify confirmation includes task title
    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Task to Delete')
    )
  })
})
