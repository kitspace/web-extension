import React, { Suspense } from 'react'
import useSWR from 'swr'
import { KITSPACE_PROCESSOR_API_KEY } from 'secrets'
import { delay } from '../../utils'

const MAX_ITERATION = 1000000

const PROCESSOR_DOMAIN = 'https://processor.master.staging.kitspace.dev'

const HEADERS = {
  Authorization: `Bearer ${KITSPACE_PROCESSOR_API_KEY}`,
  Accept: 'application/json',
}

export interface KicadPcbViewerProps {
  rawUrl: string
}

export function KicadPcbViewer({ rawUrl }: KicadPcbViewerProps) {
  return (
    <Suspense fallback={<div style={{ height: 500 }}>Loading...</div>}>
      <Viewer rawUrl={rawUrl} />
    </Suspense>
  )
}

function Viewer({ rawUrl }: KicadPcbViewerProps) {
  const { data } = useSWR(rawUrl, svgFetcher, { suspense: true })
  return <div>{data}</div>
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

  return fetch(svgUrl).then(r => r.text())
}
