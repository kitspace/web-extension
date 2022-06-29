import * as Mouser from './mouser'
import assert from 'assert'

describe('Mouser', () => {
  it('adds to cart', async () => {
    const lines = [{ part: '595-NE555P', quantity: 2, reference: 'test' }]
    const result = await Mouser.addToCart(lines)
    assert(result.success, "didn't add to cart")
  })
})