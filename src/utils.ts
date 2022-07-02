export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function waitFor<T>(
  fn: () => Promise<T>,
  timeoutMs = 5000,
  intervalMs = 10,
): Promise<T> {
  const loop = async (i) => {
    console.log('calling fn', i)
    const result = await fn()
    if (result != null) {
      return result
    }
    await delay(intervalMs)
    return loop(i + 1)
  }
  return Promise.race([
    loop(0),
    delay(timeoutMs).then(() => {
      throw Error('The `waitFor` function timed out.')
    }),
  ])
}

export async function fetchRetry(
  url,
  fetchOptions = {},
  retries = 20,
  n = 0,
): Promise<Response> {
  const response = await fetch(url, fetchOptions)
  if (!response.ok) {
    await delay(1000)
    if (n < retries) {
      return fetchRetry(url, fetchOptions, retries, n)
    }
  }
  return response
}
