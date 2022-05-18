import React from 'react'
import { KicadPcbViewer } from '../containers/KicadPcbViewer'

export function PushOnHoldOff() {
  return (
    <KicadPcbViewer rawUrl="https://raw.githubusercontent.com/kasbah/push-on-hold-off/master/cad/push-on-hold-off.kicad_pcb" />
  )
}

export function Ulx3s() {
  return (
    <KicadPcbViewer rawUrl="https://raw.githubusercontent.com/emard/ulx3s/master/ulx3s.kicad_pcb" />
  )
}

export function Ruler() {
  return (
    <KicadPcbViewer rawUrl="https://raw.githubusercontent.com/kitspace/ruler/master/ruler.kicad_pcb" />
  )
}

const meta = {
  title: 'KicadPcbViewer',
}

export default meta
