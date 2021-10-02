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
REACT_APP_AUREI_ADDRESS             = 0x9CcEB5dFbACaA5bdD90d6343d312D944F8288636
REACT_APP_BRIDGE_ADDRESS            = 0xDAb5EADe7C774638E3e5151b9504abe159B455C1
REACT_APP_FTSO_ADDRESS              = 0x352D0cFD3cc9825c13C2f69B1d6a128c6Ea8D804
REACT_APP_NATIVE_COLLATERAL_ADDRESS = 0xd529C9a7c1c221677894B679560928646E64702D
REACT_APP_REGISTRY_ADDRESS          = 0xBBf387879F189e762fd3c619374A8A38B9e31dd7
REACT_APP_TCN_TOKEN_ADDRESS         = 0x8FeBE2379eb6217a27C0D0B010Cee12158590722
REACT_APP_TELLER_ADDRESS            = 0x63F2314eD99c381E0385204d051CD3195619e337
REACT_APP_TREASURY_ADDRESS          = 0x97C81A29094Aa97b2D94715D07dC2a4384F110BD
REACT_APP_VAULT_ENGINE_ADDRESS      = 0x4dc0705d18Fce70DBBeaAa6e4aCBf6CEf96c78f4
REACT_APP_VERSION                   = $npm_package_version
```

**4. Start the app**

```
npm start
```

This starts the application at [`http://localhost:3000`](http://localhost:3000).

## Development

### Ledger Connector

TLS is required for developing the Ledger connector. It's easiest to install [mkcert](https://github.com/FiloSottile/mkcert) to create a cert.

```
# Example with hostnames and private IP addresses
mkcert -install
mkcert -cert-file local-dev.pem -key-file local-dev-key.pem trustline.dev "*.trustline.dev" localhost 127.0.0.1 10.0.0.44
```

Then you can use the `start:https` script.

## Deployment

**1. Update the version**

Make sure the version in `package.json` is updated following [semantic versioning](https://semver.org/).

**2. Deploy to GitHub Pages**

Deploy the UI to GitHub Pages (requires repository push access)

```
npm run deploy
```
