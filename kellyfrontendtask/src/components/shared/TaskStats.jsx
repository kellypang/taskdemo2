import React from 'react'
import { isOverdue } from '../../utils/taskUtils'

/**
 * Reusable TaskStats component
 * Displays task statistics dashboard
 */
export default function TaskStats({ tasks }) {
  const stats = {
    total: tasks.length,
    new: tasks.filter(t => t.status === 'NEW').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    overdue: tasks.filter(t => isOverdue(t)).length
  }

  return (
    <div className="task-stats">
      <div className="stat-card">
        <div className="stat-number">{stats.total}</div>
        <div className="stat-label">Total Tasks</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.new}</div>
        <div className="stat-label">New</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.inProgress}</div>
        <div className="stat-label">In Progress</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.completed}</div>
        <div className="stat-label">Completed</div>
      </div>
      <div className="stat-card danger">
        <div className="stat-number">{stats.overdue}</div>
        <div className="stat-label">Overdue</div>
      </div>
    </div>
  )
}
