import React from 'react'
import { Link } from 'react-router-dom'
import { formatDisplayDate, getDueDate, STATUSES } from '../../models/task'
import { getStatusColor, isOverdue } from '../../utils/taskUtils'
import StatusBadge from './StatusBadge'

/**
 * Reusable TaskTable component
 * Displays a sortable table of tasks with actions
 */
export default function TaskTable({ 
  tasks, 
  sort, 
  onToggleSort, 
  onStatusChange, 
  onDelete,
  statusUpdating = null,
  showActions = true
}) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="no-tasks">
        <p>No tasks found.</p>
      </div>
    )
  }

  const renderSortIcon = (field) => {
    if (sort.field !== field) return ''
    return sort.dir === 'asc' ? '▲' : '▼'
  }

  return (
    <div className="table-wrapper">
      <table className="task-table">
        <colgroup>
          <col style={{ width: '80px' }} />
          <col style={{ width: 'auto' }} />
          <col style={{ width: '150px' }} />
          <col style={{ width: '120px' }} />
          {showActions && <col style={{ width: '150px' }} />}
        </colgroup>
        <thead>
          <tr>
            <th>
              <button 
                className="sort-button" 
                onClick={() => onToggleSort('tasknum')}
              >
                Task # {renderSortIcon('tasknum')}
              </button>
            </th>
            <th>
              <button 
                className="sort-button" 
                onClick={() => onToggleSort('title')}
              >
                Title {renderSortIcon('title')}
              </button>
            </th>
            <th>
              <button 
                className="sort-button" 
                onClick={() => onToggleSort('status')}
              >
                Status {renderSortIcon('status')}
              </button>
            </th>
            <th>
              <button 
                className="sort-button" 
                onClick={() => onToggleSort('dueDate')}
              >
                Due Date {renderSortIcon('dueDate')}
              </button>
            </th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr 
              key={task.id} 
              className={`task-row ${isOverdue(task) ? 'overdue' : ''}`}
            >
              <td>{task.tasknum || task.id}</td>
              <td className="task-title">
                <Link to={`/tasks/${task.id}`} className="task-link">
                  {task.title}
                </Link>
                {isOverdue(task) && <span className="overdue-badge">OVERDUE</span>}
              </td>
              <td>
                {onStatusChange ? (
                  <>
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task, e.target.value)}
                      disabled={statusUpdating === task.id}
                      className="status-select"
                      style={{ color: getStatusColor(task.status) }}
                    >
                      {STATUSES.map(status => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                    {statusUpdating === task.id && <span className="updating">Updating...</span>}
                  </>
                ) : (
                  <StatusBadge status={task.status} />
                )}
              </td>
              <td className={isOverdue(task) ? 'due-date overdue' : 'due-date'}>
                {formatDisplayDate(getDueDate(task))}
              </td>
              {showActions && (
                <td className="actions">
                  <Link to={`/tasks/${task.id}`} className="btn btn-sm btn-secondary">
                    View
                  </Link>
                  <button
                    onClick={() => onDelete(task)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
