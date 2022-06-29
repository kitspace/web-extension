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

mocha.run()
