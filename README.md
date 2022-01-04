# Auth Functions

## Summary

This package provides low-level functions needed for implementation of the OAuth standard, such as JWT token generation and validation.

Automated tests: [**code coverage**](./coverage/lcov-report/index.html).

## Usage

```ts
// By importing the `default` export's object, you're getting the
// set of functions that are ready for use with zero setup
// (e.g. you don't need to configure cache).
import authFunctions from 'auth-functions';

// Then you can use functions provided:
const clientAssertion =
  await authFunctions.generateJwt(keyPair, somePayload);
```

For more examples of function usage, see [`scenario.ts`](./demo/scenario.ts).

## List of functions

| Function                       | Description                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| `generateJwt`                  | Generates a new JWT token with the desired `payload` and  signes using the keys provided. |
| `acquireAccessToken`           | Requests the IdP to issue a new JWT access token the  client can consume.                 |
| `validateAccessTokenUsingJWKS` | Validates the JWT access token's validity  by checking its signature and lifetime.        |
| `inspectJwksCache`             | Returns the current state of the JWKS cache which is  used to validate JWT access tokens. |
| `invalidateJwksCache`          | Invalidates (clears out) the entry or entries in  the JWKS cache.                         |

## Development Process

```sh
# install packages after cloning
yarn install

# build if want to test locally by consuming via a symlink
yarn build

# run end-to-end scenario test
yarn demo

# run tests once
yarn test
# OR run continuosly during development
yarn test:watch

# generate coverage report before committing
yarn test:coverage
```
