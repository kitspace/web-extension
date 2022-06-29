import { Result } from './result'

export async function init(options) {
  let mouserCountry = options.country.toLowerCase()
  if (mouserCountry === 'uk') {
    mouserCountry = 'gb'
  }
  // setting our sub-domain as the sites are all linked and switching
  // countries would not register properly otherwise
  if (mouserCountry !== 'other') {
    await fetch(
      'https://www.mouser.com/cs/localsitesredirect?subdomain=' + mouserCountry,
    )
  }
  await chrome.storage.local.set({ mouserCountry, mouserInitialized: true })
}

export async function addToCart(lines): Promise<Result> {
  const { mouserCountry } = await chrome.storage.local.get('mouserCountry')
  console.log({ mouserCountry })

  return { success: true, fails: [], warnings: [] }
}

