describe('Test', () => {
  it('should succeed', done => {
    setTimeout(done, 50)
  })

  it('should fail', done => {
    setTimeout(() => {
      throw new Error('Failed')
    }, 1000)
  })
})
