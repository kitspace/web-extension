/* eslint-disable no-console */

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const path = require('path')
const crypto = require('crypto')

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

let hasFailed = false

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
      .on('console', message => {
        console.log(
          `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`,
        )
        if (message.type() === 'error') {
          hasFailed = true
          console.error(message.text())
        }
        if (
          message.text() === 'kitspace-web-extension-suite-end' &&
          process.argv[2] === '--auto-close-browser'
        ) {
          browser.close()
          if (hasFailed) {
            process.exit(1)
          }
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
