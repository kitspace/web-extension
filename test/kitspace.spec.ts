import { test, delay } from './util'
import { expect } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })

test.beforeEach(async ({ page }) => {
  // there is some issue with the "storage" extension manifest permission, we need to
  // remove it or delay here to make the goto work
  await delay(1000)

  await page.goto('https://kitspace.org/boards/github.com/kitspace/ruler/')

  // currently 1clickBOM fires every 3 seconds to register with the page.
  // we need to give enough time to make sure it had happened before we proceed
  await delay(3010)
})

test('mouser buy parts link', async ({ page, context }) => {
  await page.locator('button', { hasText: 'Mouser' }).click()
  const distributorPage = await context.waitForEvent('page')
  await distributorPage.waitForLoadState()
  const url = distributorPage.url().toLowerCase()
  expect(url).toContain('mouser')
  expect(url).toContain('cart')
  const productRow = distributorPage.locator('.grid-row', { hasText: 'SMAJ12A' })
  await expect(productRow).toBeVisible()
})

test('farnell buy parts link', async ({ page, context }) => {
  await page.locator('button', { hasText: 'Farnell' }).click()
  const distributorPage = await context.waitForEvent('page')
  await distributorPage.waitForLoadState()
  const url = distributorPage.url().toLowerCase()
  expect(url).toContain('farnell')
  const productRow = distributorPage.locator('#orderItemLine', {
    hasText: 'SMAJ12A',
  })
  await expect(productRow).toBeVisible()
})
