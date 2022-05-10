import React, { Suspense } from 'react'
import useSWR from 'swr'
import { TOOL_PAN, UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
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
    <Suspense fallback={<div>Loading...</div>}>
      <Viewer {...props} />
    </Suspense>
  )
}

function Viewer({ rawUrl }: KicadPcbViewerProps) {
  let { data: svg, error } = useSWR(rawUrl, svgFetcher, { suspense: true })

  if (svg == null) {
    svg = <svg height={0} width={0} />
  }

  React.useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  const Viewer = React.useRef(null)

  React.useEffect(() => {
    setTimeout(() => Viewer.current.fitToViewer(), 0)
  }, [svg])

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <AutoSizer>
        {({ width, height }) => {
          return (
            <UncontrolledReactSVGPanZoom
              ref={Viewer}
              background="black"
              customMiniature={() => null}
              customToolbar={() => null}
              defaultTool={TOOL_PAN}
              detectAutoPan={false}
              height={height}
              scaleFactorOnWheel={1.3}
              SVGBackground="black"
              width={width}
            >
              {svg}
            </UncontrolledReactSVGPanZoom>
          )
        }}
      </AutoSizer>
    </div>
  )
}

async function svgFetcher(rawUrl: string) {
  try {
    const url = new URL(rawUrl, 'https://github.com')
    const blob = await fetch(url.href, { mode: 'cors' }).then(r => r.blob())

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
  } catch (e) {
    // all errors in this fetcher were getting swallowed so we log them
    // explicitly
    console.error(e)
    throw e
  }
}
