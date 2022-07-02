export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function waitFor<T>(
  fn: () => Promise<T>,
  timeoutMs = 5000,
  intervalMs = 10,
): Promise<T> {
  const loop = async () => {
    const result = await fn()
    if (result != null) {
      return result
    }
    await delay(intervalMs)
    return loop()
  }
  return Promise.race([
    loop(),
    delay(timeoutMs).then(() => {
      throw Error('The `waitFor` function timed out.')
    }),
  ])
}
