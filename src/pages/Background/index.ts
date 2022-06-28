//eslint-disable-next-line no-console
console.log('Kitspace WebExtension background script loaded')

import { Mouser } from './mouser'

chrome.webNavigation?.onHistoryStateUpdated.addListener(
  ({ tabId }) => {
    chrome.tabs.executeScript(tabId, {
      file: 'contentScript.bundle.js',
    })
  },
  { url: [{ urlMatches: 'https://github.com/.*?/blob/.*?.kicad_pcb$' }] },
)

chrome.webNavigation?.onHistoryStateUpdated.addListener(
  ({ tabId }) => {
    chrome.tabs.executeScript(tabId, {
      file: 'kitspaceContentScript.bundle.js',
    })
  },
  {
    url: [
      { hostEquals: 'kitspace.org' },
      { hostEquals: 'kitspace.dev' },
      { hostEquals: 'kitspace.test' },
    ],
  },
)

chrome.runtime.onMessage.addListener(async ({ type, value }) => {
  switch (type) {
    case 'bomBuilderAddToCart':
      const { id, purchase } = value
      const result = await addToCarts(purchase)
      break
    case 'bomBuilderClearCarts':
      break
    //case 'updateAddingState':
    //case 'quickAddToCart':
  }
})

async function addToCarts(purchase) {
  const options = await getOptions()
  const distributors = { Mouser: new Mouser(options) }
  const results = await Promise.all(
    Object.keys(purchase).map(async key => [
      key,
      await distributors[key].addToCart(purchase[key]),
    ]),
  )
  return results.reduce((obj, [key, value]) => ({ ...obj, [key]: value }))
}

async function getOptions() {
  let options = await chrome.storage.sync.get(['settings', 'country'])
  // earlier versions of this extension used "local" settings
  if (Object.keys(options).length === 0) {
    options = await chrome.storage.local.get(['settings', 'country'])
  }
  return options
}
