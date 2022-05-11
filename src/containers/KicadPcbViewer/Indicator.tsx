import React, { useState, useContext, useMemo, createContext } from 'react'
import Progress from 'react-progress'

export interface IndicatorContextProps {
  active?: boolean
  setActive?: (x: boolean) => void
  percent: number
  setPercent?: (x: number) => void
}

export const IndicatorContext = createContext({} as IndicatorContextProps)

export interface IndicatorProviderProps {
  children: React.ReactNode | React.ReactNode[]
}
export function IndicatorProvider({ children }: IndicatorProviderProps) {
  const [active, setActive] = useState(true)
  const [percent, setPercent] = useState(0)
  const value = useMemo(
    () => ({ active, setActive, percent, setPercent }),
    [active, setActive, percent, setPercent],
  )
  return (
    <IndicatorContext.Provider value={value}>{children}</IndicatorContext.Provider>
  )
}

export function Indicator() {
  const { active, percent } = useContext(IndicatorContext)
  return active ? (
    <Progress
      percent={percent}
      style={{ height: 5, position: 'absolute', top: 45 }}
    />
  ) : null
}
