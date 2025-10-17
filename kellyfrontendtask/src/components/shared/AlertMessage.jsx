import React from 'react'

/**
 * Reusable AlertMessage component
 * Displays success, error, warning, or info messages
 */
export default function AlertMessage({ message, type = 'info', onClose }) {
  if (!message) return null
  
  const alertTypes = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  }
  
  const alertClass = alertTypes[type] || alertTypes.info
  
  return (
    <div className={`alert ${alertClass}`}>
      {message}
      {onClose && (
        <button 
          onClick={onClose} 
          className="alert-close"
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  )
}
