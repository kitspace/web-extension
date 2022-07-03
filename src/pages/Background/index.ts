import * as Mouser from '../../shopping_carts/mouser'

//eslint-disable-next-line no-console
console.log('Kitspace WebExtension background script loaded')

const distributors = { Mouser }

chrome.storage.local.get(['mouserInitialized'], async ({ mouserInitialized }) => {
  if (!mouserInitialized) {
    const options = await getOptions()
    await Mouser.init(options)
  }
})

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === 'sync') {
    const options = await getOptions()
    Mouser.init(options)
  }
})

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
      //eslint-disable-next-line no-console
      console.log({ id, result })
      break
    case 'bomBuilderClearCarts':
      break
    //case 'updateAddingState':
    //case 'quickAddToCart':
  }
})

async function addToCarts(purchase) {
  const results = await Promise.all(
    Object.entries(purchase).map(async ([key, purchaseLines]) => [
      key,
      await distributors[key].addToCart(purchaseLines),
    ]),
  )
  return results.reduce((obj, [key, value]) => ({ ...obj, [key]: value }))
}

async function getOptions() {
  let options = await chrome.storage.sync.get(['settings', 'country'])
  // earlier versions of this extension used "local" settings
  if (Object.keys(options).length === 0) {
    options = await chrome.storage.local.get(['settings', 'country'])
    chrome.storage.sync.set(options)
  }

  if (options.country == null) {
    options.country = 'UK'
    chrome.storage.sync.set(options)
  }

  return options
}
