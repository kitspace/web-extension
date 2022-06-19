import path from 'path'
import { test as base, BrowserContext, chromium } from '@playwright/test'

export const test = base.extend<{ context: BrowserContext; extensionId: string }>({
  context: async ({ browserName }, use) => {
    const browserTypes = { chromium }
    const pathToExtension = path.join(__dirname, '1clickBOM-legacy')
    const context = await browserTypes[browserName].launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    })

    // mouser will block us if we don't hide that the browser is automated
    await context.addInitScript({
      path: path.join(__dirname, 'fixtures/stealth.js'),
    })

    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    // for manifest v2:
    let background = context.backgroundPages()[0]
    if (background == null) {
      background = await context.waitForEvent('backgroundpage')
    }

    /*
    // for manifest v3:
    let background = context.serviceWorkers()[0]
    if (background == null) {
      background = await context.waitForEvent('serviceworker')
    }
    */

    const extensionId = background.url().split('/')[2]
    await use(extensionId)
  },
})

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
