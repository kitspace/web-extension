import React from 'react'
import './Toolbar.css'

export interface ToolbarProps {
  onClickFit: React.MouseEventHandler<HTMLButtonElement>
}

export function Toolbar({ onClickFit }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button aria-label="Fit to view" onClick={onClickFit}>
        <Icon />
      </button>
    </div>
  )
}

function Icon() {
  return (
    <svg height="32" id="icon" viewBox="0 0 32 32" width="32">
      <defs></defs>
      <title />
      <polygon points="22 16 24 16 24 8 16 8 16 10 22 10 22 16" />
      <polygon points="8 24 16 24 16 22 10 22 10 16 8 16 8 24" />
      <path d="M26,28H6a2.0023,2.0023,0,0,1-2-2V6A2.0023,2.0023,0,0,1,6,4H26a2.0023,2.0023,0,0,1,2,2V26A2.0023,2.0023,0,0,1,26,28ZM6,6V26H26.0012L26,6Z" />
      <rect height="32" style={{ fill: 'none' }} width="32" />
    </svg>
  )
}
