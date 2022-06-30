import * as Mouser from './mouser'
import assert from 'assert'

describe('Mouser', function () {
  before(async function () {
    this.timeout(10_000)
    await Mouser.init({ country: 'UK' })
  })
  it.skip('fails to add invalid parts', async function () {
    const lines = [{ part: 'invalid-part', quantity: 2, reference: 'test-invalid' }]
    const result = await Mouser.addToCart(lines)
    assert(!result.success, "didn't fail to add invalid part")
  })
  it('adds to cart', async function () {
    const lines = [{ part: '595-NE555P', quantity: 2, reference: 'test' }]
    const result = await Mouser.addToCart(lines)
    assert(result.success, "didn't add to cart")
  })
})
