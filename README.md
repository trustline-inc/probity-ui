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

If you're working with a local development build of `@trustline-inc/bridge`, make sure that you `tsc` in the bridge project directory and install the package with `npm install --force ../bridge`.

**3. Set environment variables**

Set the environment variables for the network in `src/constants.ts`.

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

**Update the version**

Make sure the version in `package.json` is updated following [semantic versioning](https://semver.org/).

**Deploy**

1. Build the app for production: `yarn build`

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

2. Deploy a new version to the S3 bucket: `yarn deploy`

3. Invalidate the CloudFront cache:

```
aws cloudfront create-invalidation --distribution-id E1VYLNAZMQ8J88 --paths "/*"
```
