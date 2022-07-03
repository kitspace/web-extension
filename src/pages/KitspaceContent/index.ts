//eslint-disable-next-line no-console
console.log('Kitspace WebExtension content script loaded')

window.postMessage({ from: 'extension', message: 'register' }, '*')

const fromExtensionMessages = [
  'bomBuilderResult',
  'updateAddingState',
  'updateClearingState',
]
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (fromExtensionMessages.includes(message.type)) {
    window.postMessage(
      { from: 'extension', message: message.type, value: message.value },
      '*',
    )
  }
})

window.addEventListener(
  'message',
  event => {
    if (event.data.from === 'page') {
      chrome.runtime.sendMessage({
        type: event.data.message,
        value: JSON.parse(JSON.stringify(event.data.value)),
      })
    }
  },
  false,
)
