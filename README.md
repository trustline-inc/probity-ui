# ProbityDAO Portal

A public web interface for the Probity blockchain bank.

## Getting Started

This project uses [Node.js](https://nodejs.org/en/), a JavaScript runtime built on Chrome's V8 JavaScript engine.

**Create `.npmrc`**

[Authenticate with a GitHub personal access token](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token)

```
@trustline-inc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=TOKEN
```

**Install dependencies**

Use `npm` to manage dependencies

```
npm install
```

This will install React, Web3, and Aurei libraries.

**Create dotenv file**

Create `.env.local` and set the local contract addresses.

```
REACT_APP_AUREI_ADDRESS    = 0x118b2B1DBda8d8990F10BB46f5db3dbe62fC55A1
REACT_APP_BRIDGE_ADDRESS   = 0x8317d7f5b35Aa4cE34b3DA3E36e410d6D07ca7FB
REACT_APP_REGISTRY_ADDRESS = 0x0450790BCEFCfd953491f5130DFD3b572C67285F
REACT_APP_TELLER_ADDRESS   = 0x92Aaf99bB976e9912184CafEbc336fd40F4f9D5d
REACT_APP_TREASURY_ADDRESS = 0x9815ABe1030fbF11e54313a014384B22b14f0D9B
REACT_APP_VAULT_ADDRESS    = 0x003AfEce03608e69e1BBD8457fC11198AbF5982a
```

**Set environment variables**

Create `.env.local` and set contract addresses. E.g.,

```
REACT_APP_AUREI_ADDRESS    = 0x907060A75939C8bdF525355cF48F37Fde33f651F
REACT_APP_BRIDGE_ADDRESS   = 0xb6f0184c26DBDe79E19325259f79f8eB0B07aAD6
REACT_APP_REGISTRY_ADDRESS = 0x5056586C0BC91ff6B54268366D9539D4c78FeD0b
REACT_APP_TCNTOKEN_ADDRESS = 0x82756dc5c3a74422C1a95227e9A8832e33C337cb
REACT_APP_TELLER_ADDRESS   = 0x6C60a89CA41F8535F6c86Cce715035C0b5BC8b68
REACT_APP_TREASURY_ADDRESS = 0x9Afe05e7D152EBEf01e6C3d42a43c8f426C95f5b
REACT_APP_VAULT_ADDRESS    = 0x32dfE359aa1E100Ba8CfBF5f38BcBdb3f55e8a06
```

**Start the app**

This starts the application at [`http://localhost:3000`](http://localhost:3000)

```
npm start
```

## Deployment

```
npm run deploy
```
