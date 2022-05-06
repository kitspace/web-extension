import React from 'react'

export interface KicadPcbViewerProps {
  rawUrl: string
}

export function KicadPcbViewer({ rawUrl }: KicadPcbViewerProps) {
  return <div>hello from KicadPcbViewer, rawUrl: {rawUrl}</div>
}
