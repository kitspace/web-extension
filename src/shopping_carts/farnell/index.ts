import { Result, Line } from '../result'
import sites from './sites.json'
import { waitFor } from '../../utils'

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

export async function clearCart(): Promise<boolean> {
  const site = await waitForStorage('farnellSite')
  return true
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
  const text = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: params,
  }).then(r => r.text())

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
    })
    .filter(Boolean)

  return fails
}

async function getStoreId(site): Promise<string | undefined> {
  const url = `${site}/webapp/wcs/stores/servlet/AjaxOrderItemDisplayView`
  const text = await fetch(url).then(res => res.text())
  const doc = new DOMParser().parseFromString(text, 'text/html')
  const elem = doc.getElementById('storeId') as HTMLInputElement
  return elem?.value
}

function waitForStorage(key): Promise<string> {
  return waitFor(async () => {
    const result = await chrome.storage.local.get(key)
    return result[key]
  })
}
