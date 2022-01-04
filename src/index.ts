import { JwksCache } from './cache';
import {
  acquireAccessToken,
  generateJwt,
  inspectJwksCache,
  invalidateJwksCache,
  validateAccessTokenUsingJWKS
} from './functions';

const jwksCache = new JwksCache();

const library = {
  /**
   * Requests the IdP to issue a new JWT access token the client can consume.
   * @param idpServiceInfo Object containing reference to IdP service's base URL.
   * @param clientInfo Object that includes the `clientId` and `clientAssertion` (expressed in JWT string format). The `clientAssertion` is verified using the client's public key provided during the app registration matched with the `clientId`.
   * @returns The object which specifies the `tokenType` as `Bearer` and contains the JWT `accessToken` itself.
   */
  acquireAccessToken,

  /**
   * Generates a new JWT token with the desired `payload` and signes using the keys provided.
   * @param keyPair An object that includes the `privateKey` used to sign the result token and the `id` of that key. 
   * @param payload The object that lists all the claims. Claims `iss`, `iat`, `exp`, and `jti` are added automatically.
   * @param ttlInSeconds The duration for which the generated token will be valid.
   * @returns A `Promise` which resolves to the newly generated JWT token in a `string` form.
   */
  generateJwt,

  /**
   * Returns the current state of the JWKS cache which is used to validate JWT access tokens.
   * @returns A POJO that represents the current state of the JWKS cache.
   */
  inspectJwksCache:
    () =>
      inspectJwksCache(jwksCache),

  /**
   * Invalidates (clears out) the entry or entries in the JWKS cache.
   * @param jwksUrl The key of the entry in the JWKS cache to clear out. **If this value is falsy, ALL entries in the cache are invalidated.**
   */
  invalidateJwksCache:
    (jwksUrl?: string) =>
      invalidateJwksCache(jwksCache, jwksUrl),

  /**
   * Validates the JWT access token's validity by checking its signature and lifetime.
   * @param jwksServiceInfo Object with the URL of to the JWKS endpoint.
   * @param jwtInfo Object with the `accessTokenToValidate` expressed as JWT in a `string` form.
   * @returns A `Promise` that resolves to the verified **payload** part of the JWT token provided. If the token is invalid an `Error` is emitted.
   */
  validateAccessTokenUsingJWKS:
    (jwksServiceInfo: { jwksEndpoint: string }, jwtInfo: { accessTokenToValidate: string }) =>
      validateAccessTokenUsingJWKS(jwksCache, jwksServiceInfo, jwtInfo),
};

export * from './functions';
export * from './types';
export default library;
