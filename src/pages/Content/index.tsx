import React from 'react'
import { createRoot } from 'react-dom/client'
import { delay } from '../../utils'
import { KicadPcbViewer } from '../../containers/KicadPcbViewer'

//eslint-disable-next-line no-console
console.log('Kitspace WebExtension content script loaded')

const MAX_ITERATION = 1000000
const DELAY_MS = 10
const IS_VIEWER = 'data-kitspace-kicad-viewer-root'

loadKicadPcbViewer()

async function loadKicadPcbViewer() {
  const [rawUrl, codeBox] = await Promise.all([findRawUrl(), findCodeBox()])

  if (rawUrl != null && codeBox != null) {
    // due to use of onHistoryStateUpdated our content script can get loaded more
    // than once on the same page. we ensure we don't ever re-mount our react
    // app on on the same root twice by giving it a special attribute
    if (codeBox.getAttribute(IS_VIEWER)) {
      return
    }
    codeBox.setAttribute(IS_VIEWER, true)
    const initialHtml = codeBox.innerHTML
    const reactRoot = createRoot(codeBox)
    reactRoot.render(<KicadPcbViewer initialHtml={initialHtml} rawUrl={rawUrl} />)
  }
}

/* Finds the raw-url link on a github page. Will return `undefined` if it can't
 * find it within `MAX_ITERATION` loops.*/
async function findRawUrl() {
  let href
  for (let i = 0; i < MAX_ITERATION; i++) {
    href = document.getElementById('raw-url')?.getAttribute('href')
    if (href != null) {
      return href
    }
    // delay to be a less CPU intensive loop
    await delay(DELAY_MS)
  }
}

/* Finds the "code" area on a github page of a kicad_pcb file. Will return
 * `undefined` if it can't find it within `MAX_ITERATION` loops.*/
async function findCodeBox() {
  let codeBox
  for (let i = 0; i < MAX_ITERATION; i++) {
    codeBox =
      document.querySelector('.data.type-kicad-layout') ||
      document.querySelector('.data.type-text')
    if (codeBox != null) {
      return codeBox
    }
    // delay to be a less CPU intensive loop
    await delay(DELAY_MS)
  }
}
