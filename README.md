# Probity dApp

A public web interface for the Probity blockchain bank.

## Getting Started

This project uses [Node.js](https://nodejs.org/en/), a JavaScript runtime built on Chrome's V8 JavaScript engine.

**Install dependencies**

Use `npm` to manage dependencies

```
npm install
```

This will install React, Web3, and Aurei libraries.

**Create `.npmrc`**

[Authenticate with a personal access token](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token)

```
@trustline-inc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=TOKEN
```

**Start the app**

This starts the application at [`http://localhost:3000`](http://localhost:3000)

```
npm start
```

## Deployment

```
npm run predeploy && npm run deploy
```
