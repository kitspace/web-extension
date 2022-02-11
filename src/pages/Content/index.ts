import { KITSPACE_PROCESSOR_API_KEY } from 'secrets'

const processorDomain = 'https://processor.master.staging.kitspace.dev'

const headers = {
  Authorization: `Bearer ${KITSPACE_PROCESSOR_API_KEY}`,
  Accept: 'application/json',
}

async function replaceKicadPcbWithSvg() {
  const rawButton = document.getElementById('raw-url')
  if (rawButton == null) {
    console.error('Kitspace WebExtension could not find "Raw" link')
    return
  }
  const rawUrl = rawButton.getAttribute('href')
  if (rawUrl == null) {
    console.error('Kitspace WebExtension could not get `href` from "Raw" link')
    return
  }

  const blob = await fetch(rawUrl).then(r => r.blob())

  const formData = new FormData()
  formData.append('upload', blob, 'x.kicad_pcb')

  const { id } = await fetch(processorDomain + '/process-file', {
    method: 'POST',
    body: formData,
    mode: 'cors',
    headers,
  }).then(r => r.json())

  const statusUrl = `${processorDomain}/processed/status/${id}/images/layout.svg`

  let r = await fetch(statusUrl).then(r => r.json())

  while (r.status !== 'done' && r.status !== 'failed') {
    r = await fetch(statusUrl).then(r => r.json())
  }

  const svgUrl = `${processorDomain}/processed/files/${id}/images/layout.svg`

  const svg = await fetch(svgUrl).then(r => r.text())

  const codeBox =
    document.querySelector('.data.type-kicad-layout') ||
    document.querySelector('.data.type-text')

  if (codeBox == null) {
    console.error('Kitspace WebExtension could not find "code box"')
    return
  }

  codeBox.innerHTML = svg
}

replaceKicadPcbWithSvg()
