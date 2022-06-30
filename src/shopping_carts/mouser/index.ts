import { Result } from '../result'
import sites from './sites.json'

export async function init(options) {
  let countryCode = options.country.toLowerCase()
  if (countryCode === 'uk') {
    countryCode = 'gb'
  } else if (countryCode === 'other') {
    countryCode = 'www'
  }
  // setting our sub-domain as the sites are all linked and switching
  // countries would not register properly otherwise
  await fetch(
    'https://www.mouser.com/cs/localsitesredirect?subdomain=' + countryCode,
  )
  await chrome.storage.local.set({
    mouserCountry: options.country,
    mouserInitialized: true,
  })
}

export async function addToCart(lines): Promise<Result> {
  const { mouserCountry } = await chrome.storage.local.get('mouserCountry')
  const site = sites[mouserCountry]
  const cartGuid = await getCartGuid(site)
  if (!cartGuid) {
    return { success: false, fails: lines, warnings: [] }
  }
  const url = `${site}/api/Cart/AddCartItems?cartGuid=${cartGuid}&source=SearchProductDetail`

  const body = lines.map(line => ({
    MouserPartNumber: line.part,
    Quantity: line.quantity,
    MouseReelRequest: 'None',
    CustomerPartNumber: line.reference,
  }))

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(r => r.json())

  if (!response.ok || response.CartHasErrorItem) {
    return { success: false, fails: lines, warnings: [] }
  }

  return { success: true, fails: [], warnings: [] }
}

async function getCartGuid(site): Promise<string | undefined> {
  await fetch(`${site}/cart`)
  const domain = site.replace(/^https:\/\/.*?\.mouser/, '.mouser')
  const cookies = await chrome.cookies.getAll({
    domain,
    name: 'CARTCOOKIEUUID',
  })
  return cookies[0]?.value
}

async function getCartToken(site): Promise<string | undefined> {
  const text = await fetch(`${site}/cart/`).then(r => r.text())
  const doc = new DOMParser().parseFromString(text, 'text/html')
  return (doc.querySelector('form#cart-form > input') as HTMLInputElement)?.value
}

function getAddingToken(site): Promise<string | undefined> {
  const url = `${site}/price-availability/`
  return fetch(url)
    .then(r => r.text())
    .then(responseText => {
      const match = responseText.match(
        /name="__RequestVerificationToken" type="hidden" value="(.*?)"/,
      )
      if (match != null && match.length >= 2) {
        return match[1]
      }
    })
}
