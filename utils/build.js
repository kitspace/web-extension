// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'
process.env.ASSET_PATH = '/'

const configVersion = process.argv[2] === 'v2' ? 0 : 1

const webpack = require('webpack')
const config = require('../webpack.config')[configVersion]

delete config.chromeExtensionBoilerplate

config.mode = 'production'

webpack(config, function (err) {
  if (err) {
    throw err
  }
})
