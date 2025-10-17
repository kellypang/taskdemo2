import React from 'react'
import { getDateTimeValue } from '../../utils/taskUtils'

/**
 * Reusable DateTimeInput component
 * Handles datetime-local input with proper formatting
 */
export default function DateTimeInput({ 
  label, 
  value, 
  onChange, 
  error, 
  required = false, 
  disabled = false,
  id,
  className = ''
}) {
  const handleChange = (e) => {
    const newValue = e.target.value
    // Convert to ISO string if onChange expects it
    if (onChange) {
      onChange(newValue ? new Date(newValue).toISOString() : '')
    }
  }
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="datetime-local"
        value={getDateTimeValue(value)}
        onChange={handleChange}
        className={`form-input ${error ? 'error' : ''} ${className}`}
        disabled={disabled}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}
