import React from 'react'
import { getStatusColor } from '../../utils/taskUtils'

/**
 * Reusable StatusBadge component
 * Displays a status with consistent styling
 */
export default function StatusBadge({ status, className = '' }) {
  if (!status) return null
  
  const displayStatus = status.replace('_', ' ')
  const color = getStatusColor(status)
  
  return (
    <span 
      className={`status-badge ${className}`}
      style={{ backgroundColor: color }}
    >
      {displayStatus}
    </span>
  )
}
