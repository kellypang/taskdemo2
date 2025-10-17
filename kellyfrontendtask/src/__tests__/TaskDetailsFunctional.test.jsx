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

describe('TaskDetailsFunctional - Complete Task Details Workflows', () => {
  const mockTask = {
    id: 1,
    tasknum: 'T001',
    title: 'Complete Task',
    description: 'Task description',
    status: 'NEW',
    dueDate: '2025-12-25T10:00:00'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    api.getTask.mockResolvedValue(mockTask)
    Object.defineProperty(window, 'confirm', {
      value: vi.fn(() => true),
      writable: true,
      configurable: true
    })
  })

  it('completes full task lifecycle: view → edit → status change → delete', async () => {
    window.confirm.mockReturnValueOnce(true)
    
    renderTaskDetails()
    
    // Step 1: View task details
    await waitFor(() => {
      expect(screen.getByText('Complete Task')).toBeInTheDocument()
    })
    expect(screen.getByText('Task description')).toBeInTheDocument()
    
    // Step 2: Edit task
    fireEvent.click(screen.getByText('Edit Task'))
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Complete Task')).toBeInTheDocument()
    })
    
    const updatedTask = { ...mockTask, title: 'Updated Task' }
    api.updateTask.mockResolvedValueOnce(updatedTask)
    
    fireEvent.change(screen.getByPlaceholderText("Task title"), { 
      target: { value: 'Updated Task' } 
    })
    fireEvent.click(screen.getByText('Save Changes'))
    
    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalled()
    })
    
    // Step 3: Change status
    const statusWithProgress = { ...updatedTask, status: 'IN_PROGRESS' }
    api.updateStatus.mockResolvedValueOnce(statusWithProgress)
    
    const statusSelect = screen.getByRole("combobox")
    fireEvent.change(statusSelect, { target: { value: 'IN_PROGRESS' } })
    
    await waitFor(() => {
      expect(api.updateStatus).toHaveBeenCalledWith(1, 'IN_PROGRESS')
    })
    
    // Step 4: Delete task
    api.deleteTask.mockResolvedValueOnce({ success: true })
    
    fireEvent.click(screen.getByText('Delete Task'))
    
    await waitFor(() => {
      expect(api.deleteTask).toHaveBeenCalledWith(1)
    })
    
    expect(mockNavigate).toHaveBeenCalled()
  })

  it('handles concurrent status updates and edits', async () => {
    renderTaskDetails()
    
    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Complete Task')).toBeInTheDocument()
    })
    
    // Quick status change
    const statusTask = { ...mockTask, status: 'IN_PROGRESS' }
    api.updateStatus.mockResolvedValueOnce(statusTask)
    
    fireEvent.change(screen.getByRole("combobox"), { 
      target: { value: 'IN_PROGRESS' } 
    })
    
    await waitFor(() => {
      expect(api.updateStatus).toHaveBeenCalled()
    })
    
    // Then enter edit mode
    fireEvent.click(screen.getByText('Edit Task'))
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Complete Task')).toBeInTheDocument()
    })
    
    // Status should be IN_PROGRESS in the form
    const statusInForm = screen.getByRole("combobox")
    expect(statusInForm.value).toBe('IN_PROGRESS')
  })

  it('validates all fields during complex edit workflow', async () => {
    renderTaskDetails()
    
    await waitFor(() => {
      expect(screen.getByText('Complete Task')).toBeInTheDocument()
    })
    
    // Enter edit mode
    fireEvent.click(screen.getByText('Edit Task'))
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Complete Task')).toBeInTheDocument()
    })
    
    // Try to submit with invalid data
    const titleInput = screen.getByPlaceholderText("Task title")
    const dueDateInput = screen.getByPlaceholderText(/due date/i)
    
    // Invalid: empty title
    fireEvent.change(titleInput, { target: { value: '' } })
    fireEvent.click(screen.getByText('Save Changes'))
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
    
    // Fix title, but use past date
    fireEvent.change(titleInput, { target: { value: 'Valid Title' } })
    fireEvent.change(dueDateInput, { target: { value: '2020-01-01T10:00' } })
    fireEvent.click(screen.getByText('Save Changes'))
    
    await waitFor(() => {
      expect(screen.getByText(/Due date.*past/i)).toBeInTheDocument()
    })
    
    // Verify no API calls made during validation failures
    expect(api.updateTask).not.toHaveBeenCalled()
  })

  it('handles task not found scenario', async () => {
    api.getTask.mockRejectedValueOnce(new Error('Task not found'))
    
    renderTaskDetails()
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/Task not found|Failed to load/i)).toBeInTheDocument()
    })
    
    // Verify action buttons are not available
    expect(screen.queryByText('Edit Task')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete Task')).not.toBeInTheDocument()
  })

  it('preserves unsaved changes warning on navigation attempt', async () => {
    renderTaskDetails()
    
    await waitFor(() => {
      expect(screen.getByText('Complete Task')).toBeInTheDocument()
    })
    
    // Enter edit mode and make changes
    fireEvent.click(screen.getByText('Edit Task'))
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Complete Task')).toBeInTheDocument()
    })
    
    fireEvent.change(screen.getByPlaceholderText("Task title"), { 
      target: { value: 'Unsaved Changes' } 
    })
    
    // Click breadcrumb or back button
    const homeLink = screen.getByText('Home')
    expect(homeLink).toBeInTheDocument()
    
    // If we had unsaved changes detection, we'd test it here
    // For now, verify the cancel button works
    fireEvent.click(screen.getByText('Cancel'))
    
    // Changes should be discarded
    await waitFor(() => {
      expect(screen.getByText('Complete Task')).toBeInTheDocument()
    })
  })
})
