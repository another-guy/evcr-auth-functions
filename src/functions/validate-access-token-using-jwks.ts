import jsonwebtoken from 'jsonwebtoken';
import fetch, { Response } from 'node-fetch';
import { errorFromResponse } from '../xhr/error-from-response';
import nodejose from 'node-jose';
import { JwksCache } from '../cache';

export interface IJsonWebKeySet {
  keys: IJsonWebKey[];
}

export interface IJsonWebKey {
  kty?: string;
  use?: string;
  kid?: string;
  x5t?: string;
  e?: string;
  n?: string;
  x5c?: string;
}

export type IJsonWebKeySetResponse = IJsonWebKeySet;

export async function validateAccessTokenUsingJWKS(
  jwksCache: JwksCache,
  jwksServiceInfo: {
    jwksEndpoint: string,
  },
  jwtInfo: {
    accessTokenToValidate: string;
  },
  options = {
    ignoreExpiration: false,
  }
): Promise<string | jsonwebtoken.JwtPayload> {
  const { jwksEndpoint } = jwksServiceInfo;
  const { accessTokenToValidate } = jwtInfo;
  const { ignoreExpiration } = options;

  const decodedAccessToken = jsonwebtoken.decode(accessTokenToValidate, { complete: true });
  if (!decodedAccessToken) throw new Error('Decoded access token was null or undefined.');
  if (decodedAccessToken.header.typ !== 'JWT') throw new Error(`Expected 'typ' to equal 'JWT'.`);
  if (decodedAccessToken.header.alg !== 'RS256') throw new Error(`Expected 'alg' to equal 'RS256'.`);
  if (!decodedAccessToken.header.kid || !decodedAccessToken.header.kid.length) throw new Error(`Expected 'kid' to be present.`);

  const jwks = await jwksCache.tryGetValue(jwksEndpoint, () => retrieveJwks(jwksEndpoint));

  const { kid } = decodedAccessToken.header;

  const signingJwkToUseForValidation = jwks
    .keys
    .find(jsonWebKey =>
      jsonWebKey.kid === kid &&
      jsonWebKey.kty === 'RSA' &&
      jsonWebKey.n &&
      jsonWebKey.e
    );
  if (!signingJwkToUseForValidation) throw new Error(`Unable to find a valid key with id ${kid} in the keyset ${JSON.stringify(jwks, null, 2)}.`);

  const jwkKey = await nodejose.JWK.asKey(signingJwkToUseForValidation);

  const verifiedJwtPayload = jsonwebtoken
    .verify(
      accessTokenToValidate,
      jwkKey.toPEM(false),
      {
        ignoreExpiration,
        clockTolerance: 60,
      },
    );

  return Promise.resolve(verifiedJwtPayload);
}

async function retrieveJwks(jwksEndpoint: string): Promise<IJsonWebKeySetResponse> {
  const response: Response = await fetch(
    jwksEndpoint,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!response.ok) throw errorFromResponse(response);

  const accessTokenResponse = await response.json() as IJsonWebKeySetResponse;
  return accessTokenResponse;
}

