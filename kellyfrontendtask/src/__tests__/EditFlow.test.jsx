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

describe('EditFlow - Complete Task Editing Workflow', () => {
  const mockTask = {
    id: 1,
    tasknum: 'T001',
    title: 'Original Title',
    description: 'Original description',
    status: 'NEW',
    dueDate: '2025-12-25T10:00:00'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    api.getTask.mockResolvedValue(mockTask)
  })

  it('completes full edit workflow: load → edit mode → update → view mode', async () => {
    const updatedTask = {
      ...mockTask,
      title: 'Updated Title',
      description: 'Updated description'
    }
    
    api.updateTask.mockResolvedValueOnce(updatedTask)
    
    renderTaskDetails()
    
    // Wait for initial task load
    await waitFor(() => {
      expect(screen.getByText('Original Title')).toBeInTheDocument()
    })
    
    // Enter edit mode
    const editButton = screen.getByText('Edit Task')
    fireEvent.click(editButton)
    
    // Verify edit form is displayed
    await waitFor(() => {
      expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument()
    })
    
    // Update the fields
    const titleInput = screen.getByPlaceholderText("Task title")
    const descriptionInput = screen.getByPlaceholderText(/description/i)
    
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } })
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } })
    
    // Save the changes
    const saveButton = screen.getByText('Save Changes')
    fireEvent.click(saveButton)
    
    // Verify API was called with updated data (component calls with { id, ...editForm })
    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalledWith({
        id: 1,
        title: 'Updated Title',
        description: 'Updated description',
        dueDate: '2025-12-25T10:00:00',
        status: 'NEW'
      })
    })
    
    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/Task updated successfully/i)).toBeInTheDocument()
    })
    
    // Verify returned to view mode with updated content
    await waitFor(() => {
      expect(screen.getByText('Updated Title')).toBeInTheDocument()
    })
  })

  it('validates form data during edit workflow', async () => {
    renderTaskDetails()
    
    // Wait for task load
    await waitFor(() => {
      expect(screen.getByText('Original Title')).toBeInTheDocument()
    })
    
    // Enter edit mode
    fireEvent.click(screen.getByText('Edit Task'))
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument()
    })
    
    // Clear required fields
    const titleInput = screen.getByPlaceholderText("Task title")
    fireEvent.change(titleInput, { target: { value: '' } })
    
    // Try to save
    fireEvent.click(screen.getByText('Save Changes'))
    
    // Verify validation error
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
    
    // Verify API was NOT called
    expect(api.updateTask).not.toHaveBeenCalled()
  })

  it('allows canceling edit workflow', async () => {
    renderTaskDetails()
    
    // Wait for task load
    await waitFor(() => {
      expect(screen.getByText('Original Title')).toBeInTheDocument()
    })
    
    // Enter edit mode
    fireEvent.click(screen.getByText('Edit Task'))
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument()
    })
    
    // Make changes
    const titleInput = screen.getByPlaceholderText("Task title")
    fireEvent.change(titleInput, { target: { value: 'Changed but not saved' } })
    
    // Cancel the edit
    fireEvent.click(screen.getByText('Cancel'))
    
    // Verify original data is still displayed
    await waitFor(() => {
      expect(screen.getByText('Original Title')).toBeInTheDocument()
    })
    
    // Verify API was NOT called
    expect(api.updateTask).not.toHaveBeenCalled()
  })

  it('handles API errors during edit workflow', async () => {
    // Use a future date to pass validation
    const futureTask = {
      ...mockTask,
      dueDate: '2026-12-25T10:00:00'
    }
    api.getTask.mockResolvedValue(futureTask)
    api.updateTask.mockRejectedValueOnce(new Error('Update failed'))
    
    renderTaskDetails()
    
    // Wait for task load
    await waitFor(() => {
      expect(screen.getByText('Original Title')).toBeInTheDocument()
    })
    
    // Enter edit mode and make changes
    fireEvent.click(screen.getByText('Edit Task'))
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument()
    })
    
    fireEvent.change(screen.getByPlaceholderText("Task title"), { 
      target: { value: 'Updated Title' } 
    })
    
    // Try to save
    fireEvent.click(screen.getByText('Save Changes'))
    
    // Wait for API call
    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalled()
    })
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to update task/i)).toBeInTheDocument()
    })
  })
})
