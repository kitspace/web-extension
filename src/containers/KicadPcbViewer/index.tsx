import React, { Suspense } from 'react'
import useSWR from 'swr'
import { TOOL_PAN, UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
import { AutoSizer } from 'react-virtualized'
import { delay } from '../../utils'
import { toH } from 'hast-to-hyperscript'
import { parse as parseSVG } from 'svg-parser'
import { KITSPACE_PROCESSOR_API_KEY } from 'secrets'
import { SvgStyle } from './SvgStyle'
import { Toolbar } from './Toolbar'
import {
  Indicator,
  IndicatorContext,
  IndicatorFallback,
  IndicatorProvider,
} from './Indicator'
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
  initialHtml?: string
}

export function KicadPcbViewer(props: KicadPcbViewerProps) {
  let fallback = null
  // use the html we are replacing in the fallback if we have it
  if (props.initialHtml) {
    fallback = <div dangerouslySetInnerHTML={{ __html: props.initialHtml }} />
  }
  return (
    <IndicatorProvider>
      <Indicator />
      <Suspense fallback={<IndicatorFallback>{fallback}</IndicatorFallback>}>
        <Viewer {...props} />
      </Suspense>
    </IndicatorProvider>
  )
}

function Viewer({ rawUrl }: KicadPcbViewerProps) {
  const { setPercent } = React.useContext(IndicatorContext)
  let { data: svg, error } = useSWR(rawUrl, url => svgFetcher(url, setPercent), {
    suspense: true,
  })

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
    setTimeout(() => Viewer.current?.fitToViewer('center', 'center'), 0)
  }, [svg])

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <SvgStyle />
      <AutoSizer>
        {({ width, height }) => {
          return (
            <>
              <Toolbar
                onClickFit={() => Viewer.current?.fitToViewer('center', 'center')}
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

async function svgFetcher(rawUrl: string, setPercent) {
  try {
    const url = new URL(rawUrl, 'https://github.com')
    const blob = await fetch(url.href, { mode: 'cors' }).then(r => r.blob())
    setPercent(20)

    const formData = new FormData()
    formData.append('upload', blob, 'x.kicad_pcb')

    const { id } = await fetch(PROCESSOR_DOMAIN + '/process-file', {
      method: 'POST',
      body: formData,
      mode: 'cors',
      headers: HEADERS,
    }).then(r => r.json())
    setPercent(30)

    const statusUrl = `${PROCESSOR_DOMAIN}/processed/status/${id}/images/layout.svg`

    let r = await fetch(statusUrl).then(r => r.json())

    setPercent(40)

    for (let i = 0; i < MAX_ITERATION; i++) {
      r = await fetch(statusUrl).then(r => r.json())
      if (i / 10 < 50) {
        setPercent(40 + i / 10)
      }
      if (r.status === 'done' || r.status === 'failed') {
        break
      }
      await delay(10)
    }
    setPercent(90)

    const svgUrl = `${PROCESSOR_DOMAIN}/processed/files/${id}/images/layout.svg`

    const svg = await fetch(svgUrl).then(r => r.text())
    setPercent(91)

    const svgHAST = parseSVG(svg)
    setPercent(92)

    const element = toH(React.createElement, svgHAST)
    setPercent(93)

    setTimeout(() => {
      setPercent(95)
    }, 500)

    setTimeout(() => {
      setPercent(99.99)
    }, 3000)

    return element
  } catch (e) {
    // all errors in this fetcher were getting swallowed so we log them
    // explicitly
    console.error(e)
    throw e
  }
}
