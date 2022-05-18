const myProjectConfig = require('../webpack.config')

module.exports = {
  webpackFinal: config => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: myProjectConfig.resolve.alias,
      },
    }
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
}
