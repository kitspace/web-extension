import * as Mouser from './index'
import assert from 'assert'

describe('Mouser', function () {
  before(async function () {
    this.timeout(10_000)
    await Mouser.init({ country: 'UK' }).catch(e => {
      console.error(e)
      assert.fail(e)
    })
  })
  beforeEach(async function () {
    this.timeout(10_000)
    const didClearCart = await Mouser.clearCart()
    assert(didClearCart, "didn't clear cart")
  })
  it('fails to add invalid parts', async function () {
    const lines = [{ part: 'invalid-part', quantity: 2, reference: 'test-invalid' }]
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
    this.timeout(10_000)
    let lines = [{ part: 'invalid-part', quantity: 2, reference: 'test-invalid' }]
    let result = await Mouser.addToCart(lines)
    assert(!result.success, "didn't fail")

    lines = [{ part: '595-NE555P', quantity: 2, reference: 'test' }]
    result = await Mouser.addToCart(lines)
    assert(result.success, "didn't succeed")
  })
})
