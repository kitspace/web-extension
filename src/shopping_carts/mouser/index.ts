import { Result } from '../result'
import sites from './sites.json'
import { getMouserSkus } from './partinfo'
import { waitFor } from '../../utils'

export async function init(options) {
  let subdomain = 'www2'

  if (options.country !== 'Other' && sites[options.country] != null) {
    subdomain = options.country.toLowerCase()
  }
  if (subdomain === 'uk') {
    subdomain = 'gb'
  } else if (subdomain === 'us') {
    subdomain = 'www'
  }

  const mouserSite = sites[options.country] || sites['Other']

  // setting our sub-domain as the sites are all linked and switching
  // countries would not register properly otherwise
  await fetch('https://www.mouser.com/cs/localsitesredirect?subdomain=' + subdomain)
  await chrome.storage.local.set({ mouserSite })
}

export async function addToCart(lines): Promise<Result> {
  const site = await waitForStorage('mouserSite')
  const cartGuid = await getCartGuid(site)
  if (!cartGuid) {
    return { success: false, fails: lines, warnings: [] }
  }
  await clearCartErrors(site)
  lines = await addDashes(lines)
  const url = `${site}/api/Cart/AddCartItems?cartGuid=${cartGuid}&source=SearchProductDetail`
  const body = lines.map(line => ({
    MouserPartNumber: line.part,
    Quantity: line.quantity,
    MouseReelRequest: 'None',
    CustomerPartNumber: line.reference,
  }))
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(r => r.json())
  if (response.CartHasErrorItem) {
    const fails = response.Items.filter(item => item.HasError)
      .map(item => lines.find(line => line.part === item.MouserPartNumber))
      .filter(Boolean)
    return { success: false, fails, warnings: [] }
  }
  return { success: true, fails: [], warnings: [] }
}

export async function clearCart(): Promise<boolean> {
  const site = await waitForStorage('mouserSite')
  const cartToken = await getCartToken(site)
  if (!cartToken) {
    return false
  }
  const url = `${site}/Cart/Cart/DeleteCart`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: `__RequestVerificationToken=${cartToken}`,
  })
  return response.ok
}

async function clearCartErrors(site): Promise<boolean> {
  const cartToken = await getCartToken(site)
  if (!cartToken) {
    return false
  }
  const url = `${site}/Cart/`
  const text = await fetch(url).then(r => r.text())
  const doc = new DOMParser().parseFromString(text, 'text/html')
  const errors = doc.querySelectorAll('.grid-row.row-error')
  const ids = Array.from(errors).map(e => e.getAttribute('data-itemid'))
  const responses = await Promise.all(
    ids.map(id => {
      const url = `${site}/Cart/Cart/DeleteCartItem?cartItemId=${id}&page=null&grid-column=SortColumn&grid-dir=0`
      return fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `__RequestVerificationToken=${cartToken}`,
      })
    }),
  )
  return responses.every(r => r.ok)
}

async function getCartGuid(site): Promise<string | undefined> {
  await fetch(`${site}/Cart/`)
  const domain = site.replace(/^https:\/\/.*?\.mouser/, '.mouser')
  const cookies = await chrome.cookies.getAll({
    domain,
    name: 'CARTCOOKIEUUID',
  })
  return cookies[0]?.value
}

async function getCartToken(site): Promise<string | undefined> {
  const text = await fetch(`${site}/cart`).then(r => r.text())
  const doc = new DOMParser().parseFromString(text, 'text/html')
  return (doc.querySelector('form#cart-form > input') as HTMLInputElement)?.value
}

//eslint-disable-next-line
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

async function addDashes(lines): Promise<Array<object>> {
  // we used to always remove dashes in our mouser part numbers but mouser API
  // doesn't accept those any more.
  const partsWithoutDashes = lines
    .filter(line => !/-/.test(line.part))
    .map(line => line.part)
  if (partsWithoutDashes.length === 0) {
    return lines
  }
  const newParts = await getMouserSkus(partsWithoutDashes)
  return lines.map(line => ({
    ...line,
    part: newParts.find(p => p.replace(/-/g, '') === line.part) || line.part,
  }))
}

function waitForStorage(key): Promise<string> {
  return waitFor(async () => {
    const result = await chrome.storage.local.get(key)
    return result[key]
  })
}
