//eslint-disable-next-line no-console
console.log('This is the background page.')

chrome.webNavigation.onHistoryStateUpdated.addListener(
  ({ tabId }) => {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['contentScript.bundle.js'],
    })
  },
  { url: [{ urlMatches: 'https://github.com/.*?/blob/.*?.kicad_pcb$' }] },
)
