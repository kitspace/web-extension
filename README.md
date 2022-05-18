# The Kitspace WebExtension

A browser extension for people interested in electronics. The initial version will:

- Render .kicad_pcb files on Github
- Allow you to "buy parts" on kitspace.org and port most of the rest of the functionality of [1clickBOM](https://github.com/kitspace/1clickBOM).

## Development

### Setup

Set up [Nodejs](https://nodejs.org) (version 16 or higher) and [install Yarn (v1/classic)](https://classic.yarnpkg.com/en/docs/install#debian-stable). Clone this repo and install all dependencies by running:

```
git clone https://github.com/kitspace/web-extension
cd web-extension
yarn
```

This project uses the [kitspace-v2](https://github.com/kitspace/kitspace-v2) API to process files. Ask [@kasbah](https://github.com/kasbah) for an API key and create a `secrets.development.js` with:

```js
export const KITSPACE_PROCESSOR_API_KEY = 'your key'
```


## Scripts

The build system is adapted from [chrome-extension-boilerplate-react](https://github.com/lxieyang/chrome-extension-boilerplate-react). It currently builds both a manifest-v3 Chrome extension and a manifest-v2 Firefox/WebExtension.

### Development

- `yarn dev` to auto-rebuild the extension into `build/manifest-v3/` load that folder as an unpacked extension in Chrome. Most changes will require you to manually reload the extension in Chrome.
- `yarn dev v2` to auto-rebuild into `build/manifest-v2/` (for Firefox and maybe Safari) and then `yarn web-ext run` to open/auto-reload it in a vanilla browser profile.
- `yarn storybook` will run a Storybook component preview on [localhost:6006](http://localhost:6006). This is useful for fast-reload of React components and currently the only way to test it with a custom/development version of the kitspace-v2 API running over http.

### Building

- `yarn build` will output to `build/manifest-v2/` and `build/manifest-v3/` in production mode.
- `yarn web-ext sign --api-key <addon-api-key> --api-secret <addon-api-secret>` will make an unlisted but signed .xpi file that you can "load from file" in Firefox.

### Linting

- `yarn lint --fix` to lint and to auto-fix any issues where it can.
- `yarn fmt` to auto-format everything with Prettier.
- `yarn tsc` to typecheck with Typescript.
- `yarn web-ext lint` will lint the build output in `build/manifest-v2/`.
