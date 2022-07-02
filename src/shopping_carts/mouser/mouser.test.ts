import * as Mouser from './index'
import assert from 'assert'
import { over100MouserParts } from './mouser.fixture'
import countries from '../countries.json'
import sites from './sites.json'
import { delay } from '../../utils'

describe('Mouser', function () {
  this.timeout(20_000)
  before(async function () {
    // initial delay seems to be needed to pass first test
    await delay(1000)
  })
  afterEach(async function () {
    // delay in between or we get flagged as a bot
    await delay(5000)
  })
  describe('init', function () {
    for (const country of Object.values(countries)) {
      it(`initializes ${country}`, async function () {
        await Mouser.init({ country }).catch(e => {
          console.error(e)
          assert.fail(e)
        })
        // make sure our site data is the actual domain in-use
        // i.e. not getting redirected
        const site = sites[country]
        if (site != null) {
          let response = await fetch(site)
          assert(response.ok, `didn't get ${site}`)
          assert(!response.redirected, `got redirected for ${site}`)
          response = await fetch(site + '/Cart/')
          assert(response.ok, `didn't get ${site}/Cart/`)
          assert(!response.redirected, `got redirected for ${site}/Cart/`)
        }
      })
    }
  })
  describe('cart', function () {
    for (const country of Object.keys(sites)) {
      testSuite(country)
    }
  })
})

function testSuite(country) {
  describe(country, function () {
    before(async function () {
      await Mouser.init({ country }).catch(e => {
        console.error(e)
        assert.fail(e)
      })
    })
    beforeEach(async function () {
      const didClearCart = await Mouser.clearCart()
      assert(didClearCart, "didn't clear cart")
    })
    it('fails to add invalid parts', async function () {
      const lines = [
        { part: 'invalid-part', quantity: 2, reference: 'test-invalid' },
      ]
      const result = await Mouser.addToCart(lines)
      assert(!result.success, "didn't fail to add invalid part")
    })
    it('adds to cart', async function () {
      const lines = [{ part: '595-NE555P', quantity: 2, reference: 'test' }]
      const result = await Mouser.addToCart(lines)
      assert(result.success, "didn't add to cart")
    })
    it('finds out which parts failed', async function () {
      const lines = [
        { part: '595-NE555P', quantity: 2, reference: 'test' },
        { part: 'invalid-part', quantity: 2, reference: 'test-invalid' },
      ]
      const result = await Mouser.addToCart(lines)
      assert(!result.success, "didn't fail")
      assert(
        result.fails.length === 1,
        `fails should be length 1 but is ${result.fails.length}`,
      )
      assert(result.fails[0].part === 'invalid-part', "didn't fail invalid part")
    })
    it('clears previous cart errors', async function () {
      let lines = [{ part: 'invalid-part', quantity: 2, reference: 'test-invalid' }]
      let result = await Mouser.addToCart(lines)
      assert(!result.success, "didn't fail")

      lines = [{ part: '595-NE555P', quantity: 2, reference: 'test' }]
      result = await Mouser.addToCart(lines)
      assert(result.success, "didn't succeed")
    })
    it('adds part number without dashes to cart', async function () {
      const lines = [{ part: '595NE555P', quantity: 2, reference: 'test' }]
      const result = await Mouser.addToCart(lines)
      assert(result.success, "didn't add part without dashes to cart")
    })
    it('merges parts with same part numbers', async function () {
      const lines = [
        { part: '595NE555P', quantity: 2, reference: 'test1' },
        { part: '595-NE555P', quantity: 2, reference: 'test2' },
        { part: '595NE555P', quantity: 3, reference: 'test3' },
      ]
      const site = sites[country] || sites['Other']
      const result = await Mouser.addToCart(lines)
      assert(result.success, "didn't add merged parts")
      const text = await fetch(`${site}/Cart/`).then(r => r.text())
      const doc = new DOMParser().parseFromString(text, 'text/html')
      assert(
        (doc.querySelector('[name="CartItems[0].Quantity"]') as HTMLInputElement)
          .value === '7',
        "didn't merge parts",
      )
    })
    it('adds more than 100 parts', async function () {
      this.timeout(60_000)
      const lines = over100MouserParts
      const result = await Mouser.addToCart(lines)
      assert(result.success, "didn't add more than 100 parts")
    })
  })
}
