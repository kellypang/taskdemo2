import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import CreateTask from '../pages/CreateTask'
import * as api from '../api/tasks'

// Mock the API
vi.mock('../api/tasks', () => ({
  createTask: vi.fn()
}))

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

function renderCreateTask() {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CreateTask />
    </BrowserRouter>
  )
}

describe('CreateFlow - Complete Task Creation Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('completes full create workflow: form → API → navigation', async () => {
    // Mock successful API response
    const mockCreatedTask = {
      id: 1,
      tasknum: 'T001',
      title: 'New Task',
      description: 'Test description',
      status: 'NEW',
      dueDate: '2025-12-31T10:00:00'
    }
    
    api.createTask.mockResolvedValueOnce(mockCreatedTask)
    
    renderCreateTask()
    
    // Verify form is rendered
    expect(screen.getByText('Create New Task')).toBeInTheDocument()
    
    // Fill in the form
    const titleInput = screen.getByPlaceholderText(/title/i)
    const descriptionInput = screen.getByPlaceholderText(/description/i)
    const dueDateInput = screen.getByPlaceholderText(/due date/i)
    const statusSelect = screen.getByRole("combobox")
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } })
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } })
    fireEvent.change(dueDateInput, { target: { value: '2025-12-31T10:00' } })
    fireEvent.change(statusSelect, { target: { value: 'NEW' } })
    
    // Submit the form
    const submitButton = screen.getByText('Create Task')
    fireEvent.click(submitButton)
    
    // Verify API was called with correct data
    await waitFor(() => {
      expect(api.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Test description',
        dueDate: expect.stringMatching(/2025-12-31T10:00/),
        status: 'NEW'
      })
    })
    
    // Verify navigation occurred after successful creation (with 1500ms delay in component)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    }, { timeout: 2000 })
  })

  it('handles validation errors in create workflow', async () => {
    renderCreateTask()
    
    // Try to submit empty form
    const submitButton = screen.getByText('Create Task')
    fireEvent.click(submitButton)
    
    // Verify validation errors are shown
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
      expect(screen.getByText('Due date is required')).toBeInTheDocument()
    })
    
    // Verify API was NOT called
    expect(api.createTask).not.toHaveBeenCalled()
    
    // Verify no navigation occurred
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('handles API errors gracefully in create workflow', async () => {
    api.createTask.mockRejectedValueOnce(new Error('Server error'))
    
    renderCreateTask()
    
    // Fill in valid form data
    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'Test Task' } })
    fireEvent.change(screen.getByPlaceholderText(/due date/i), { target: { value: '2025-12-31T10:00' } })
    
    // Submit the form
    fireEvent.click(screen.getByText('Create Task'))
    
    // Wait for API call
    await waitFor(() => {
      expect(api.createTask).toHaveBeenCalled()
    })
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to create task/i)).toBeInTheDocument()
    })
    
    // Verify no navigation occurred on error
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('allows canceling the create workflow', async () => {
    renderCreateTask()
    
    // Fill in some data
    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'Test Task' } })
    
    // Click cancel button
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    // Verify navigation to home occurred
    expect(mockNavigate).toHaveBeenCalled()
    
    // Verify API was not called
    expect(api.createTask).not.toHaveBeenCalled()
  })
})
