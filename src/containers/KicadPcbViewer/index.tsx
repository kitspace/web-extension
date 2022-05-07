import React, { Suspense } from 'react'
import useSWR from 'swr'
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
import { AutoSizer } from 'react-virtualized'
import { delay } from '../../utils'
import './KicadPcbViewer.styles.css'
import { toH } from 'hast-to-hyperscript'
import { parse as parseSVG } from 'svg-parser'
import { KITSPACE_PROCESSOR_API_KEY } from '../../../secrets.development.js'

const MAX_ITERATION = 1000000

const PROCESSOR_DOMAIN = 'https://processor.review.staging.kitspace.dev'
//const PROCESSOR_DOMAIN = 'http://processor.kitspace.test:3000'

const HEADERS = {
  Authorization: `Bearer ${KITSPACE_PROCESSOR_API_KEY}`,
  Accept: 'application/json',
}

export interface KicadPcbViewerProps {
  rawUrl: string
}

export function KicadPcbViewer(props: KicadPcbViewerProps) {
  return (
    <Suspense fallback={<div style={{ height: 500 }}>Loading...</div>}>
      <Viewer {...props} />
    </Suspense>
  )
}

function Viewer({ rawUrl }: KicadPcbViewerProps) {
  const { data: svg } = useSWR(rawUrl, svgFetcher, { suspense: true })

  const Viewer = React.useRef(null)

  React.useEffect(() => {
    setTimeout(() => Viewer.current.fitToViewer(), 0)
  }, [])

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <AutoSizer>
        {({ width, height }) => {
          return (
            <>
              <UncontrolledReactSVGPanZoom
                ref={Viewer}
                height={height}
                width={width}
              >
                {svg}
              </UncontrolledReactSVGPanZoom>
            </>
          )
        }}
      </AutoSizer>
    </div>
  )
}

async function svgFetcher(rawUrl: string) {
  const blob = await fetch(rawUrl).then(r => r.blob())

  const formData = new FormData()
  formData.append('upload', blob, 'x.kicad_pcb')

  const { id } = await fetch(PROCESSOR_DOMAIN + '/process-file', {
    method: 'POST',
    body: formData,
    mode: 'cors',
    headers: HEADERS,
  }).then(r => r.json())

  const statusUrl = `${PROCESSOR_DOMAIN}/processed/status/${id}/images/layout.svg`

  let r = await fetch(statusUrl).then(r => r.json())

  for (let i = 0; i < MAX_ITERATION; i++) {
    r = await fetch(statusUrl).then(r => r.json())
    if (r.status === 'done' || r.status === 'failed') {
      break
    }
    await delay(10)
  }

  const svgUrl = `${PROCESSOR_DOMAIN}/processed/files/${id}/images/layout.svg`

  const svg = await fetch(svgUrl).then(r => r.text())

  const svgHAST = parseSVG(svg)

  return toH(React.createElement, svgHAST)

  //const svgDoc = new DOMParser().parseFromString(svg, 'image/svg+xml')

  //const svgWidth = parseFloat(svgDoc.documentElement.getAttribute('width'))
  //const svgHeight = parseFloat(svgDoc.documentElement.getAttribute('height'))
  //svgDoc.documentElement.removeAttribute('width')
  //svgDoc.documentElement.removeAttribute('height')
  //const viewBox = svgDoc.documentElement.getAttribute('viewBox')

  //const svgXML = svgDoc.documentElement.outerHTML
  //return { svgXML, svgWidth, svgHeight, viewBox }
}
