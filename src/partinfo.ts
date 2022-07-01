const partinfoURL = 'https://dev-partinfo.kitspace.org/graphql'

const SkuQuery = `
  query SkuQuery($skus: [SkuInput]!) {
    match(skus: $skus) {
      offers(from: "Mouser") {
        sku {
          part
        }
      }
    }
  }
`

export async function getMouserSkus(parts): Promise<Array<string>> {
  const skus = parts.map(part => ({ part, vendor: 'Mouser' }))
  const result = await fetch(partinfoURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: SkuQuery,
      variables: {
        skus,
      },
    }),
  }).then(r => r.json())
  return result.data.match.map(m => m.offers[0]?.sku.part)
}
