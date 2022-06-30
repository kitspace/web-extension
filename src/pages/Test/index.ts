/* eslint-disable no-console */

import 'mocha/mocha.css'
import 'mocha/browser-entry.js'

mocha.setup('bdd')

const context = require.context(
  '../../', // Root directory
  true, // Recursive
  /.+\.test\.ts$/, // Test pattern
)

// Require each within build
context.keys().forEach(context)

mocha
  .run()
  .on('test end', function (test) {
    if ('passed' === test.state) {
      console.log('passed!', test.title)
    } else if (test.pending) {
      console.log('pending!', test.title)
    }
  })
  .on('fail', (test, err) => {
    console.error('fail!', test.title)
    let err = test.err
    console.error(err)
  })
  .on('suite end', function (suite) {
    if (suite.root) {
      console.log({ suite })
      console.log('kitspace-web-extension-suite-end')
    }
  })
