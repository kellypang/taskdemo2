import React from 'react'
import { STATUSES } from '../../models/task'
import DateTimeInput from './DateTimeInput'

/**
 * Reusable TaskForm component
 * Shared form fields for creating and editing tasks
 */
export default function TaskForm({ 
  formData, 
  errors, 
  onChange, 
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  submitting = false,
  showStatus = true
}) {
  const handleChange = (field) => (e) => {
    onChange(field, e.target.value)
  }

  const handleDateChange = (value) => {
    onChange('dueDate', value)
  }

  return (
    <form onSubmit={onSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="title" className="form-label required">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          value={formData.title || ''}
          onChange={handleChange('title')}
          placeholder="Enter a descriptive title for your task"
          className={`form-input ${errors.title ? 'error' : ''}`}
          disabled={submitting}
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={handleChange('description')}
          placeholder="Provide additional details about the task (optional)"
          rows={4}
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          disabled={submitting}
        />
        <div className="char-count">
          {(formData.description || '').length}/500 characters
        </div>
        {errors.description && <div className="error-message">{errors.description}</div>}
      </div>

      <div className={showStatus ? "form-row" : ""}>
        <DateTimeInput
          id="dueDate"
          label="Due Date & Time"
          value={formData.dueDate}
          onChange={handleDateChange}
          error={errors.dueDate}
          required
          disabled={submitting}
        />

        {showStatus && (
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              value={formData.status || 'NEW'}
              onChange={handleChange('status')}
              className="form-select"
              disabled={submitting}
            >
              {STATUSES.map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary btn-lg"
        >
          {submitting ? (
            <>
              <span className="spinner"></span>
              {submitLabel}...
            </>
          ) : (
            submitLabel
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="btn btn-secondary btn-lg"
          >
            {cancelLabel}
          </button>
        )}
      </div>
    </form>
  )
}
