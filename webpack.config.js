const webpack = require('webpack')
const path = require('path')
const fileSystem = require('fs-extra')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const ASSET_PATH = process.env.ASSET_PATH || '/'
const NODE_ENV = process.env.NODE_ENV || 'development'

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
]

const alias = {}
const secretsPath = path.join(__dirname, `secrets.${NODE_ENV}.js`)
if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath
}

const options = ['manifest-v2', 'manifest-v3'].map(manifestVersion => {
  const outputDir = path.resolve(__dirname, 'build', manifestVersion)
  const option = {
    name: manifestVersion,
    mode: NODE_ENV,
    entry: {
      options: path.join(__dirname, 'src', 'pages', 'Options', 'index.tsx'),
      background: path.join(__dirname, 'src', 'pages', 'Background', 'index.ts'),
      contentScript: path.join(__dirname, 'src', 'pages', 'Content', 'index.tsx'),
      popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.tsx'),
    },
    output: {
      filename: '[name].bundle.js',
      path: outputDir,
      clean: true,
      publicPath: ASSET_PATH,
    },
    performance: {
      maxEntrypointSize: 512000 /* bytes */,
      maxAssetSize: 512000 /* bytes */,
    },
    module: {
      rules: [
        {
          // look for .css or .scss files
          test: /\.(css|scss)$/,
          // in the `src` directory
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
          type: 'asset/resource',
          exclude: /node_modules/,
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
          exclude: /node_modules/,
        },
        { test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/ },
        {
          test: /\.(js|jsx)$/,
          use: [
            {
              loader: 'source-map-loader',
            },
            {
              loader: 'babel-loader',
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      alias: alias,
      extensions: fileExtensions
        .map(extension => '.' + extension)
        .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
    },
    plugins: [
      new CleanWebpackPlugin({ verbose: false }),
      new webpack.ProgressPlugin(),
      // expose and write the allowed env vars on the compiled bundle
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/manifest.json',
            to: path.join(outputDir),
            force: true,
            transform(content) {
              const v3 = {
                // adds info from package.json
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              }
              if (manifestVersion === 'manifest-v3') {
                return Buffer.from(JSON.stringify(v3))
              }

              const v2 = {
                manifest_version: 2,
                name: v3.name,
                description: v3.description,
                version: v3.version,
                options_page: v3.options_page,
                background: {
                  page: 'background.html',
                },
                browser_action: v3.action,
                icons: v3.icons,
                content_scripts: v3.content_scripts,
                permissions: v3.permissions
                  .filter(p => p !== 'scripting')
                  .concat(v3.host_permissions),
                web_accessible_resources: v3.web_accessible_resources.reduce(
                  (result, r) => result.concat(r.resources),
                  [],
                ),
                content_security_policy: "script-src 'self'; object-src 'self'",
              }
              return Buffer.from(JSON.stringify(v2))
            },
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/pages/Content/content.styles.css',
            to: outputDir,
            force: true,
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/assets/img/icon-128.png',
            to: outputDir,
            force: true,
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/assets/img/icon-34.png',
            to: outputDir,
            force: true,
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'pages', 'Options', 'index.html'),
        filename: 'options.html',
        chunks: ['options'],
        cache: false,
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'pages', 'Popup', 'index.html'),
        filename: 'popup.html',
        chunks: ['popup'],
        cache: false,
      }),
    ],
    infrastructureLogging: {
      level: 'info',
    },
  }
  if (manifestVersion === 'manifest-v2') {
    option.plugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'pages', 'Background', 'index.html'),
        filename: 'background.html',
        chunks: ['background'],
        cache: false,
      }),
    )
  }
  if (NODE_ENV === 'development') {
    option.devtool = 'cheap-module-source-map'
  } else {
    option.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    }
  }
  return option
})

module.exports = options
