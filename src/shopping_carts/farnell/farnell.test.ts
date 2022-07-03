import * as Farnell from './index'
import assert from 'assert'
import { over100FarnellParts } from './farnell.fixture'
import countries from '../countries.json'
import sites from './sites.json'
import { delay } from '../../utils'

describe('Farnell', function () {
  this.timeout(120_000)
  afterEach(async function () {
    // delay in between or we get flagged as a bot
    await delay(5000)
  })
  describe('init', function () {
    for (const country of Object.values(countries)) {
      it(`initializes ${country}`, async function () {
        await Farnell.init({ country }).catch(e => {
          console.error(e)
          assert.fail(e)
        })
        // make sure our site data is the actual domain in-use
        // i.e. not getting redirected
        const site = sites[country]
        if (site != null) {
          const response = await fetch(site)
          assert(response.ok, `didn't get ${site}`)
          assert(!response.redirected, `got redirected for ${site}`)
        }
      })
    }
  })
  describe('cart', function () {
    for (const country of Object.keys(sites)) {
      testCountry(country)
    }
  })
})

function testCountry(country) {
  describe(country, function () {
    before(async function () {
      await Farnell.init({ country }).catch(e => {
        console.error(e)
        assert.fail(e)
      })
    })
    beforeEach(async function () {
      const didClearCart = await Farnell.clearCart()
      assert(didClearCart, "didn't clear cart")
    })
    it('fails to add invalid parts', async function () {
      const lines = [
        { part: 'invalid-part', quantity: 2, reference: 'test-invalid' },
      ]
      const result = await Farnell.addToCart(lines)
      assert(!result.success, "didn't fail to add invalid part")
    })
    it('adds to cart', async function () {
      const lines = [{ part: '3006909', quantity: 2, reference: 'test' }]
      const result = await Farnell.addToCart(lines)
      assert(result.success, "didn't add to cart")
    })
    it('finds out which parts failed', async function () {
      const lines = [
        { part: '3006909', quantity: 2, reference: 'test' },
        { part: 'invalid-part', quantity: 2, reference: 'test-invalid' },
      ]
      const result = await Farnell.addToCart(lines)
      assert(!result.success, "didn't fail")
      assert(
        result.fails.length === 1,
        `fails should be length 1 but is ${result.fails.length}`,
      )
      assert(result.fails[0].part === 'invalid-part', "didn't fail invalid part")
    })
    it('finds out which parts failed 2', async function () {
      const lines = [
        { part: '3006909', quantity: 2, reference: 'test' },
        { part: 'invalid-part', quantity: 2, reference: 'test-invalid' },
        { part: 'invalid-part2', quantity: 2, reference: 'test-invalid2' },
      ]
      const result = await Farnell.addToCart(lines)
      assert(!result.success, "didn't fail")
      assert(
        result.fails.length === 2,
        `fails should be length 2 but is ${result.fails.length}`,
      )
      assert(
        result.fails.find(l => l.part === 'invalid-part'),
        "didn't fail invalid part",
      )
      assert(
        result.fails.find(l => l.part === 'invalid-part2'),
        "didn't fail invalid part 2",
      )
    })
    it('clears previous cart errors', async function () {
      let lines = [{ part: 'invalid-part', quantity: 2, reference: 'test-invalid' }]
      let result = await Farnell.addToCart(lines)
      assert(!result.success, "didn't fail")

      lines = [{ part: '3006909', quantity: 2, reference: 'test' }]
      result = await Farnell.addToCart(lines)
      assert(result.success, "didn't succeed")
    })
    it('merges parts with same part numbers', async function () {
      const lines = [
        { part: '3006909', quantity: 2, reference: 'test1' },
        { part: '3006909', quantity: 3, reference: 'test2' },
      ]
      const site = sites[country] || sites['Other']
      const result = await Farnell.addToCart(lines)
      assert(result.success, "didn't add merged parts")
      const text = await fetch(
        `${site}/webapp/wcs/stores/servlet/AjaxOrderItemDisplayView`,
      ).then(r => r.text())
      const doc = new DOMParser().parseFromString(text, 'text/html')
      assert(
        (doc.querySelector('[name="quantity_1"]') as HTMLInputElement).value ===
          '5',
        "didn't merge parts",
      )
    })
    it.skip('adds more than 100 parts', async function () {
      this.timeout(60_000)
      const lines = over100FarnellParts
      const result = await Farnell.addToCart(lines)
      assert(result.success, "didn't add more than 100 parts")
    })
  })
}
