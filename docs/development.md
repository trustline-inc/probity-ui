# Developer Guide

## Getting Started

This project uses [Node.js](https://nodejs.org/en/), a JavaScript runtime built on Chrome's V8 JavaScript engine.

**1. Install dependencies**

Use `npm` to manage dependencies

```
npm install
```

This will install React, Web3, and Probity libraries.

**2. Set environment variables**

Set the environment variables for the desired network in `src/constants.ts`.

Create `.env` in the project root with the following variables defined:

```
PORT=8000
REACT_APP_REQUIRE_AUTH=false
REACT_APP_NATIVE_TOKEN=<FLR|SGB|XRP>
REACT_APP_VERSION=$npm_package_version
```

**3. Start the app**

```
npm start
```

This starts the application at [`http://localhost:8000`](http://localhost:8000).

## Local Development with TLS

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
