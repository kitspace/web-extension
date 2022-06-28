//eslint-disable-next-line no-console
console.log('This is the background page.')

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

chrome.runtime.onMessage.addListener(({ type, value }) => {
  switch (type) {
    case 'bomBuilderAddToCart':
      const { id, purchase } = value
      Object.keys(purchase).forEach(distributor => {

      })
      return console.log({ value })
    case 'bomBuilderClearCarts':
      return
    //case 'updateAddingState':
    //case 'quickAddToCart':
  }
})
