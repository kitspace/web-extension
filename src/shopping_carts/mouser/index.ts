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
  await clearCartErrors(site)
  let { linesWithDashes, fails } = await addDashes(site, lines)
  lines = linesWithDashes
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
    fails = fails.concat(
      response.Items.filter(item => item.HasError)
        .map(item => lines.find(line => line.part === item.MouserPartNumber))
        .filter(Boolean),
    )
    return { success: false, fails, warnings: [] }
  }
  return { success: true, fails, warnings: [] }
}

export async function clearCart(): Promise<boolean> {
  const { mouserCountry } = await chrome.storage.local.get('mouserCountry')
  const site = sites[mouserCountry]
  const cartToken = await getCartToken(site)
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

  const url = `${site}/cart/`
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

interface AddDashesResult {
  linesWithDashes: Array<any>
  fails: Array<any>
}

async function addDashes(site, lines): Promise<AddDashesResult> {
  // this is not great, we used to remove dashes in our mouser part numbers but
  // mouser API doesn't accept those any more. below we do a search and get the
  // mouser part number with dashes from the page

  let linesWithDashes = await Promise.all(
    lines.map(async line => {
      if (/-/.test(line.part)) {
        return line
      }
      const text = await fetch(`${site}/c/?q=${line.part}`).then(r => r.text())
      try {
        const doc = new DOMParser().parseFromString(text, 'text/html')
        let mouserPartElem = doc.getElementById(
          'spnMouserPartNumFormattedForProdInfo',
        )
        if (mouserPartElem == null) {
          // it's a search result page, we take the first result
          mouserPartElem = doc.getElementsByClassName('mpart-number-lbl')[0]
        }
        const mouserPart = mouserPartElem.innerHTML.trim()
        if (mouserPart.replace(/-/g, '') !== line.part) {
          return { fail: line }
        }
        return { ...line, part: mouserPart }
      } catch (e) {
        console.warn(e)
        return { fail: line }
      }
    }),
  )

  linesWithDashes = linesWithDashes.filter(line => !line.fail)
  const fails = linesWithDashes.filter(line => line.fail).map(line => line.fail)
  return { linesWithDashes, fails }
}
