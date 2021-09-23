# Probity Frontend

A public react interface for the Probity blockchain app.

## Getting Started

This project uses [Node.js](https://nodejs.org/en/), a JavaScript runtime built on Chrome's V8 JavaScript engine.

**1. Create `.npmrc`**

This step is temporary until the NPM package is made public.

[Authenticate with a GitHub personal access token](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token)

```
@trustline-inc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=TOKEN
```

**2. Install dependencies**

Use `npm` to manage dependencies

```
npm install
```

This will install React, Web3, and Probity libraries.

**3. Set environment variables**

Create `.env.local` and set contract addresses. For example:

```
REACT_APP_AUREI_ADDRESS    = 0x907060A75939C8bdF525355cF48F37Fde33f651F
REACT_APP_BRIDGE_ADDRESS   = 0xb6f0184c26DBDe79E19325259f79f8eB0B07aAD6
REACT_APP_REGISTRY_ADDRESS = 0x5056586C0BC91ff6B54268366D9539D4c78FeD0b
REACT_APP_TCNTOKEN_ADDRESS = 0x82756dc5c3a74422C1a95227e9A8832e33C337cb
REACT_APP_TELLER_ADDRESS   = 0x6C60a89CA41F8535F6c86Cce715035C0b5BC8b68
REACT_APP_TREASURY_ADDRESS = 0x9Afe05e7D152EBEf01e6C3d42a43c8f426C95f5b
REACT_APP_VAULT_ADDRESS    = 0x32dfE359aa1E100Ba8CfBF5f38BcBdb3f55e8a06
```

**4. Start the app**

```
npm start
```

This starts the application at [`http://localhost:3000`](http://localhost:3000).

## Deployment

**1. Update the version**

Make sure the version in `package.json` is updated following [semantic versioning](https://semver.org/).

**2. Deploy to GitHub Pages**

Deploy the UI to GitHub Pages (requires repository push access)

```
npm run deploy
```
