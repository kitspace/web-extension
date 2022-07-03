import promiseRateLimit from 'promise-rate-limit'
import { Result, Line } from '../result'
import sites from './sites.json'
import { waitFor, retry } from '../../utils'

const headers = {
  'content-type': 'application/x-www-form-urlencoded',
}

const fetch = promiseRateLimit(3, 1000, global.fetch)

export async function init({ country }) {
  const farnellSite = sites[country] || sites['Other']
  await chrome.storage.local.set({ farnellSite, farnellInitialized: true })
}

export async function addToCart(lines): Promise<Result> {
  const site = await waitForStorage('farnellSite')
  const storeId = await getStoreId(site)
  if (storeId == null) {
    return { success: false, fails: lines, warnings: [] }
  }
  // TODO handle truncating line-notes (if still needed)
  //if (reference.length > 30) {
  //  warnings.push(`Truncated line-note when adding
  //                ${this.name} line to cart: ${line.reference}`)
  //}

  const fails = await addToCartReturnFails(site, storeId, lines)
  return { success: fails.length === 0, fails, warnings: [] }
}

async function addToCartReturnFails(site, storeId, lines): Promise<Array<Line>> {
  const url = `${site}/AjaxPasteOrderChangeServiceItemAdd`
  let params = `storeId=${storeId}&catalogId=&langId=-1&omItemAdd=quickPaste&URL=AjaxOrderItemDisplayView%3FstoreId%3D10194%26catalogId%3D15003%26langId%3D-1%26quickPaste%3D*&errorViewName=QuickOrderView&calculationUsage=-1%2C-2%2C-3%2C-4%2C-5%2C-6%2C-7&isQuickPaste=true&quickPaste=`
  for (const line of lines) {
    params += encodeURIComponent(line.part) + ','
    params += encodeURIComponent(line.quantity) + ','
    const reference = line.reference.replace(/,/g, ' ')
    params += encodeURIComponent(reference.substr(0, 30)) + '\n'
  }
  const text = await retry(fetch, [
    url,
    {
      method: 'POST',
      headers,
      body: params,
    },
  ]).then(r => r.text())

  // the response is a bit cursed, it's JSON inside a JS comment, even if
  // we send a 'accept: application/json' header
  const json = JSON.parse(text.slice(4, -4))

  if (!json.hasPartNumberErrors && !json.hasCommentErrors) {
    return []
  }
  const fails = Object.keys(json)
    .map(key => {
      const match = key.match(/^errqp_partNumber_(\d+)/)
      if (match != null && match[1] != null) {
        const i = parseInt(match[1], 10) - 1
        return lines[i]
      }
      return false
    })
    .filter(Boolean)

  return fails
}

export async function clearCart(): Promise<boolean> {
  const site = await waitForStorage('farnellSite')
  const [cartIds, storeId] = await Promise.all([getCartIds(site), getStoreId(site)])
  if (cartIds == null || storeId == null) {
    return false
  }
  const url = `${site}/webapp/wcs/stores/servlet/ProcessBasket`
  let params = `langId=&orderId=&catalogId=&BASE_URL=BasketPage&errorViewName=BasketErrorAjaxResponse&storeId=${storeId}&URL=BasketDataAjaxResponse&calcRequired=true&orderItemDeleteAll=&isBasketUpdated=true`
  cartIds.forEach(id => {
    params += `&orderItemDelete=${id}`
  })
  const response = await retry(fetch, [
    url,
    { method: 'POST', headers, body: params },
  ])
  return response.ok
}

async function getCartIds(site): Promise<Array<string> | null> {
  const url = `${site}/webapp/wcs/stores/servlet/AjaxOrderItemDisplayView`
  // we should be able to get the cart, but sometimes it fails
  // let's retry till we can get it
  const inputs: NodeListOf<HTMLInputElement> | undefined = await waitFor(
    async () => {
      const text = await retry(fetch, [url]).then(r => r.text())
      console.log('getCartIds text')
      const doc = new DOMParser().parseFromString(text, 'text/html')
      console.log('getCartIds doc')
      const orderDetails = doc.querySelector('#order_details')
      const tbody = orderDetails?.querySelector('tbody')
      const inputs = tbody?.querySelectorAll('input')
      console.log('inputs is null:', inputs == null)
      return inputs
    },
    { timeoutMs: 60_000 },
  ).catch(e => {
    // timed out?
    console.error('getCartIds:')
    console.error(e)
    return null
  })

  if (inputs == null) {
    return null
  }

  return Array.from(inputs)
    .map(input => {
      if (input.type === 'hidden' && /orderItem_/.test(input.id)) {
        return input.value
      }
      return null
    })
    .filter(Boolean)
}

function getStoreId(site): Promise<string | null> {
  const url = `${site}/webapp/wcs/stores/servlet/AjaxOrderItemDisplayView`
  return waitFor(
    async () => {
      const text = await retry(fetch, [url]).then(res => res.text())
      console.log('text')
      const doc = new DOMParser().parseFromString(text, 'text/html')
      console.log('doc')
      const elem = doc.getElementById('storeId') as HTMLInputElement
      console.log('elem is null:', elem == null)
      return elem?.value
    },
    { timeoutMs: 60_000 },
  ).catch(e => {
    // timed out?
    console.error('getStoreId:')
    console.error(e)
    return null
  })
}

function waitForStorage(key): Promise<string> {
  return waitFor(async () => {
    const result = await chrome.storage.local.get(key)
    return result[key]
  })
}
