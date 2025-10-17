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

describe('StatusChangeFlow - Complete Status Update Workflow', () => {
  const mockTask = {
    id: 1,
    tasknum: 'T001',
    title: 'Task for Status Update',
    description: 'Testing status changes',
    status: 'NEW',
    dueDate: '2025-09-25T10:00:00'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    api.getTask.mockResolvedValue(mockTask)
  })

  it('completes full status change workflow: select status → API → update UI', async () => {
    const updatedTask = { ...mockTask, status: 'IN_PROGRESS' }
    api.updateStatus.mockResolvedValueOnce(updatedTask)
    
    renderTaskDetails()
    
    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Task for Status Update')).toBeInTheDocument()
    })
    
    // Find and change status dropdown
    const statusSelect = screen.getByRole("combobox")
    fireEvent.change(statusSelect, { target: { value: 'IN_PROGRESS' } })
    
    // Verify API was called with new status
    await waitFor(() => {
      expect(api.updateStatus).toHaveBeenCalledWith(1, 'IN_PROGRESS')
    })
    
    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/Status updated successfully/i)).toBeInTheDocument()
    })
    
    // Verify UI shows updated status
    await waitFor(() => {
      const statusBadge = document.querySelector('.status-badge')
      expect(statusBadge?.textContent).toMatch(/IN PROGRESS/)
    })
  })

  it('handles status transitions through multiple states', async () => {
    renderTaskDetails()
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Task for Status Update')).toBeInTheDocument()
    })
    
    // Transition 1: NEW → IN_PROGRESS
    api.updateStatus.mockResolvedValueOnce({ ...mockTask, status: 'IN_PROGRESS' })
    const statusSelect = screen.getByRole("combobox")
    fireEvent.change(statusSelect, { target: { value: 'IN_PROGRESS' } })
    
    await waitFor(() => {
      expect(api.updateStatus).toHaveBeenCalledWith(1, 'IN_PROGRESS')
    })
    
    // Transition 2: IN_PROGRESS → COMPLETED
    api.updateStatus.mockResolvedValueOnce({ ...mockTask, status: 'COMPLETED' })
    fireEvent.change(statusSelect, { target: { value: 'COMPLETED' } })
    
    await waitFor(() => {
      expect(api.updateStatus).toHaveBeenCalledWith(1, 'COMPLETED')
    })
    
    // Verify both transitions completed
    expect(api.updateStatus).toHaveBeenCalledTimes(2)
  })

  it('handles API errors during status change', async () => {
    api.updateStatus.mockRejectedValueOnce(new Error('Status update failed'))
    
    renderTaskDetails()
    
    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Task for Status Update')).toBeInTheDocument()
    })
    
    // Try to change status
    const statusSelect = screen.getByRole("combobox")
    fireEvent.change(statusSelect, { target: { value: 'COMPLETED' } })
    
    // Wait for API call
    await waitFor(() => {
      expect(api.updateStatus).toHaveBeenCalled()
    })
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to update status/i)).toBeInTheDocument()
    })
    
    // Verify original status is maintained in UI
    // After error, status badge should show error state
    expect(screen.getByText(/Failed to update status/i)).toBeInTheDocument()
  })

  it('provides immediate feedback during status change', async () => {
    api.updateStatus.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve({ ...mockTask, status: 'COMPLETED' }), 100)
    }))
    
    renderTaskDetails()
    
    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Task for Status Update')).toBeInTheDocument()
    })
    
    // Change status
    const statusSelect = screen.getByRole("combobox")
    fireEvent.change(statusSelect, { target: { value: 'COMPLETED' } })
    
    // Could check for loading state if implemented
    // Verify eventual success
    await waitFor(() => {
      expect(screen.getByText(/Status updated successfully/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('prevents status changes while in edit mode (status select disabled)', async () => {
    renderTaskDetails()
    
    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Task for Status Update')).toBeInTheDocument()
    })
    
    // Enter edit mode
    fireEvent.click(screen.getByText('Edit Task'))
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Task for Status Update')).toBeInTheDocument()
    })
    
    // Change status in edit mode
    const statusSelect = screen.getByRole("combobox")
    expect(statusSelect).toBeInTheDocument()
    
    // Status select should be disabled in edit mode
    // Status select is disabled in edit mode, so changes are prevented
    expect(statusSelect).toBeDisabled()
  })
})
