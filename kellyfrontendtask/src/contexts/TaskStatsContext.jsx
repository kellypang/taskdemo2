import React, { createContext, useContext, useState } from 'react'

const TaskStatsContext = createContext()

export function TaskStatsProvider({ children }) {
  const [taskStats, setTaskStats] = useState(null)
  
  return (
    <TaskStatsContext.Provider value={{ taskStats, setTaskStats }}>
      {children}
    </TaskStatsContext.Provider>
  )
}

export function useTaskStats() {
  const context = useContext(TaskStatsContext)
  if (!context) {
    throw new Error('useTaskStats must be used within TaskStatsProvider')
  }
  return context
}
