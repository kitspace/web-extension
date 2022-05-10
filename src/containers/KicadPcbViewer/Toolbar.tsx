import React, { MouseEventHandler } from 'react'

export interface ToolbarProps {
  onClickFit: MouseEventHandler<HTMLButtonElement>
}

export function Toolbar({ onClickFit }: ToolbarProps) {
  return (
    <div>
      <style jsx>{`
        position: absolute;
        z-index: 1;
        right: 10px;
        top: 10px;
        button {
          background-color: transparent;
          font-size: 14pt;
          color: white;
          cursor: pointer;
          border: none;
          fill: grey;
        }
        button:hover {
          fill: white;
        }
      `}</style>
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
