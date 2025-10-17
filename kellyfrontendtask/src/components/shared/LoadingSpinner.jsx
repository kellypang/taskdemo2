import React from 'react'

/**
 * Reusable LoadingSpinner component
 * Displays a loading state with optional message
 */
export default function LoadingSpinner({ message = 'Loading...', size = 'medium' }) {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }
  
  return (
    <div className="loading-container">
      <div className={`spinner ${sizeClasses[size] || sizeClasses.medium}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  )
}
