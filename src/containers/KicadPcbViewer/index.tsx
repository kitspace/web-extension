import React, { Suspense } from 'react'
import useSWR from 'swr'
import { TOOL_PAN, UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
import { AutoSizer } from 'react-virtualized'
import { delay } from '../../utils'
import { toH, Element } from 'hast-to-hyperscript'
import { parse as parseSVG } from 'svg-parser'
import { fromDom } from 'hast-util-from-dom'
import { KITSPACE_PROCESSOR_API_KEY } from 'secrets'
import { SvgStyle } from './SvgStyle'
import { Toolbar } from './Toolbar'
import kicadTheme from './kicadThemeDefault.json'

const MAX_ITERATION = 1000000

const PROCESSOR_DOMAIN = 'https://processor.review.staging.kitspace.dev'
//const PROCESSOR_DOMAIN = 'http://processor.kitspace.test:3000'

const HEADERS = {
  Authorization: `Bearer ${KITSPACE_PROCESSOR_API_KEY}`,
  Accept: 'application/json',
}

export interface KicadPcbViewerProps {
  rawUrl: string
  initialDom?: HTMLElement
}

export function KicadPcbViewer(props: KicadPcbViewerProps) {
  let fallback = <div>Loading...</div>
  // use the html we are replacing in the fallback if we have it
  if (props.initialDom) {
    const hast = fromDom(props.initialDom)
    const initial = toH(React.createElement, hast as Element)
    fallback = (
      <div>
        <div>Loading...</div>
        {initial}
      </div>
    )
  }
  return (
    <Suspense fallback={fallback}>
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
    setTimeout(() => Viewer.current.fitToViewer('center', 'center'), 0)
  }, [svg])

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <SvgStyle />
      <AutoSizer>
        {({ width, height }) => {
          return (
            <>
              <Toolbar
                onClickFit={() => Viewer.current.fitToViewer('center', 'center')}
              />
              <UncontrolledReactSVGPanZoom
                ref={Viewer}
                background={kicadTheme.board.background}
                customMiniature={() => null}
                customToolbar={() => null}
                defaultTool={TOOL_PAN}
                detectAutoPan={false}
                height={height}
                scaleFactorOnWheel={1.3}
                SVGBackground={kicadTheme.board.background}
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
