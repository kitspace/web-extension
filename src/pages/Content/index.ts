import { KITSPACE_PROCESSOR_API_KEY } from 'secrets'

//eslint-disable-next-line no-console
console.log('content script loaded')

const processorDomain = 'https://processor.master.staging.kitspace.dev'

const headers = {
  Authorization: `Bearer ${KITSPACE_PROCESSOR_API_KEY}`,
  Accept: 'application/json',
}

replaceKicadPcbWithSvg()

async function replaceKicadPcbWithSvg() {
  const rawUrl = await findRawUrl()
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

/* Finds the raw-url link on a github page. Will never return if it can't find it.*/
async function findRawUrl() {
  let href = document.getElementById('raw-url')?.getAttribute('href')
  while (href == null) {
    // wait 10ms to be a less CPU intensive loop (in case it never finds it)
    await new Promise(resolve => setTimeout(resolve, 10))
    href = document.getElementById('raw-url')?.getAttribute('href')
  }
  return href
}
