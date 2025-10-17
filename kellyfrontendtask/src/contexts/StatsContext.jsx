import React, { createContext, useContext, useState } from 'react'

const StatsContext = createContext()

export function StatsProvider({ children }) {
  const [stats, setStats] = useState(null)
  
  return (
    <StatsContext.Provider value={{ stats, setStats }}>
      {children}
    </StatsContext.Provider>
  )
}

export function useStats() {
  const context = useContext(StatsContext)
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider')
  }
  return context
}
