import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
  createContext,
} from 'react'
import Progress from 'react-progress'

export interface IndicatorContextProps {
  active?: boolean
  setActive?: (x: boolean) => void
}

export const IndicatorContext = createContext({} as IndicatorContextProps)

export interface IndicatorProviderProps {
  children: React.ReactNode | React.ReactNode[]
}
export function IndicatorProvider({ children }: IndicatorProviderProps) {
  const [active, setActive] = useState(false)
  const value = useMemo(() => ({ active, setActive }), [active, setActive])
  return (
    <IndicatorContext.Provider value={value}>{children}</IndicatorContext.Provider>
  )
}

export function Indicator() {
  const { active } = useContext(IndicatorContext)
  const [percent, setPercent] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setPercent(percent => (percent < 100 ? percent + 10 : 100))
    }, 200)
  })
  return active ? (
    <Progress percent={percent} style={{ position: 'absolute', top: 43 }} />
  ) : null
}

export interface IndicatorProps {
  children: JSX.Element
}

export function IndicatorFallback({ children }: IndicatorProps) {
  const { setActive } = useContext(IndicatorContext)
  useEffect(() => {
    setActive(true)
    return () => setActive(false)
  })
  return children
}
