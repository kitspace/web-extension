/* eslint-disable no-console */

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const path = require('path')
const crypto = require('crypto')

const autoCloseBrowser = process.argv[2] === '--auto-close-browser'

const extensionPath = path.join(__dirname, 'build/manifest-v3')

// this is how chromium determines the extension id of an unpacked extension
const extensionId = crypto
  .createHash('sha256')
  .update(extensionPath)
  .digest('hex')
  .split('')
  .slice(0, 32)
  .map(x => String.fromCharCode(parseInt(x, 16) + 97))
  .join('')

puppeteer.use(StealthPlugin())

puppeteer
  .launch({
    headless: false,
    executablePath: 'chromium',
    ignoreDefaultArgs: ['--disable-extensions'],
    args: [`--load-extension=${extensionPath}`],
  })
  .then(async browser => {
    const page = await browser.newPage()
    page
      .on('console', async message => {
        const argsText = (
          await Promise.all(message.args().map(arg => describe(arg)))
        ).join(' ')
        console.log(`${message.type().substr(0, 3).toUpperCase()} ${argsText}`)
        if (
          autoCloseBrowser &&
          message.type() === 'error' &&
          message.text().startsWith('fail!')
        ) {
          browser.close()
          process.exit(1)
        } else if (
          autoCloseBrowser &&
          message.text() === 'kitspace-web-extension-suite-end'
        ) {
          browser.close()
        }
      })
      .on('pageerror', ({ message }) => {
        // ignore unsafe-eval errors that we can't seem to prevent
        if (
          !message.startsWith(
            "EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script",
          )
        ) {
          console.log('PAGE ERROR', message)
        }
      })
      .on('response', response =>
        console.log(`${response.status()} ${response.url()}`),
      )
      .on('requestfailed', request =>
        console.error(`${request.failure().errorText} ${request.url()}`),
      )
    await page.goto(`chrome-extension://${extensionId}/test.html`)
  })

function describe(jsHandle) {
  return jsHandle.executionContext().evaluate(obj => {
    return `${obj}`
  }, jsHandle)
}
