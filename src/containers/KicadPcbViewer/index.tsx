import React, { Suspense } from 'react'
import useSWR from 'swr'
import { TOOL_PAN, UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
import { AutoSize } from 'react-autosize-container'
import { delay } from '../../utils'
import { toH } from 'hast-to-hyperscript'
import { parse as parseSVG } from 'svg-parser'
import { KITSPACE_PROCESSOR_API_KEY } from 'secrets'
import { SvgStyle } from './SvgStyle'
import { Toolbar } from './Toolbar'
import { Indicator, IndicatorContext, IndicatorProvider } from './Indicator'
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
  let fallback = <EmptyViewer />
  // use the html we are replacing (i.e. the kicad_pcb text view) in the
  // fallback while loading, if we have it
  if (props.initialHtml) {
    fallback = (
      <div
        dangerouslySetInnerHTML={{ __html: props.initialHtml }}
        style={{ marginTop: 7 }}
      />
    )
  }
  return (
    <IndicatorProvider>
      <Indicator />
      <Suspense fallback={fallback}>
        <Viewer {...props} />
      </Suspense>
    </IndicatorProvider>
  )
}

function Viewer({ rawUrl }: KicadPcbViewerProps) {
  const { setPercent } = React.useContext(IndicatorContext)
  let { data: svg, error } = useSWR(rawUrl, url => svgFetcher(url, setPercent), {
    suspense: true,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  })

  React.useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <AutoSize>
        {({ width, height }) => {
          // seems to happen while loading
          if (width === 0 || height === 0) {
            return <EmptyViewer />
          }
          return <SvgPanZoom height={height} svg={svg} width={width} />
        }}
      </AutoSize>
    </div>
  )
}

interface SvgPanZoomProps {
  width: number
  height: number
  svg: React.ReactElement
}

function SvgPanZoom(props: SvgPanZoomProps) {
  const { setActive } = React.useContext(IndicatorContext)
  React.useEffect(() => {
    if (props.width > 0 && props.height > 0) {
      setActive(false)
    }
  }, [props.width, props.height, setActive])

  const Viewer = React.useRef(null)
  React.useEffect(() => {
    Viewer.current?.fitToViewer('center', 'center')
  }, [props.svg])

  return (
    <>
      <SvgStyle />
      <Toolbar onClickFit={() => Viewer.current?.fitToViewer('center', 'center')} />
      <UncontrolledReactSVGPanZoom
        ref={Viewer}
        background={kicadTheme.board.background}
        customMiniature={() => null}
        customToolbar={() => null}
        defaultTool={TOOL_PAN}
        detectAutoPan={false}
        height={props.height}
        scaleFactorOnWheel={1.3}
        SVGBackground={kicadTheme.board.background}
        width={props.width}
      >
        {props.svg}
      </UncontrolledReactSVGPanZoom>
    </>
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
    setPercent(99)

    const svgUrl = `${PROCESSOR_DOMAIN}/processed/files/${id}/images/layout.svg`

    const svg = await fetch(svgUrl).then(r => r.text())

    const svgHAST = parseSVG(svg)
    const element = toH(React.createElement, svgHAST)

    return element
  } catch (e) {
    // all errors in this fetcher were getting swallowed so we log them
    // explicitly
    console.error(e)
    throw e
  }
}

function EmptyViewer() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: kicadTheme.board.background,
      }}
    />
  )
}
