import { Link, useLocation } from 'react-router-dom'
import { useTaskStats } from '../contexts/TaskStatsContext'

export default function Header() {
  const location = useLocation()
  const { taskStats } = useTaskStats()
  
  function isActive(path) {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/tasks'
    }
    return location.pathname.startsWith(path)
  }
  
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">📋</span>
            <span className="brand-text">TaskManager</span>
          </Link>
        </div>
        
        {taskStats && (
          <div className="header-stats">
            <div className="header-stat-item">
              <span className="header-stat-number">{taskStats.total}</span>
              <span className="header-stat-label">Total</span>
            </div>
            <div className="header-stat-item">
              <span className="header-stat-number">{taskStats.new}</span>
              <span className="header-stat-label">New</span>
            </div>
            <div className="header-stat-item">
              <span className="header-stat-number">{taskStats.inProgress}</span>
              <span className="header-stat-label">In Progress</span>
            </div>
            <div className="header-stat-item">
              <span className="header-stat-number">{taskStats.completed}</span>
              <span className="header-stat-label">Completed</span>
            </div>
            <div className="header-stat-item danger">
              <span className="header-stat-number">{taskStats.overdue}</span>
              <span className="header-stat-label">Overdue</span>
            </div>
          </div>
        )}
        
        <nav className="header-navigation">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            title="View all tasks"
          >
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/tasks/new" 
            className={`nav-link nav-link-create ${isActive('/tasks/new') ? 'active' : ''}`}
            title="Create new task"
          >
            <span className="nav-icon">➕</span>
            <span>Create New Task</span>
          </Link>
          
          <Link 
            to="/tasks/search" 
            className={`nav-link ${isActive('/tasks/search') ? 'active' : ''}`}
            title="Search and filter tasks"
          >
            <span className="nav-icon">🔍</span>
            <span>Search</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
