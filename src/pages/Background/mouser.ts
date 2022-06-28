import { Result } from './result'

export class Mouser {
  constructor(options) {
    let countryCode = options.country.toLowerCase()
    if (countryCode === 'uk') {
      countryCode = 'gb'
    }
    // setting our sub-domain as the sites are all linked and switching
    // countries would not register properly otherwise
    if (countryCode !== 'other') {
      fetch('https://www.mouser.com/cs/localsitesredirect?subdomain=' + countryCode)
    }
  }
  async addToCart(lines): Promise<Result> {
    return { success: true, fails: [], warnings: [] }
  }
}
