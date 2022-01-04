import fetch, { Response } from 'node-fetch';
import { IJsonWebKeySetResponse } from '.';
import { JwksCache } from '../cache';
import { validateAccessTokenUsingJWKS } from './validate-access-token-using-jwks';
jest.mock('node-fetch');

describe(validateAccessTokenUsingJWKS.name, () => {
  let mockFetch: jest.MockedFunction<typeof fetch>;
  let jwksCache: JwksCache;
  let jwksServiceInfo: { jwksEndpoint: string };
  let jwtInfo: { accessTokenToValidate: string };
  let mockJsonWebKeySetResponse: IJsonWebKeySetResponse;

  beforeEach(() => {
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    jwksCache = new JwksCache();
    jwksCache.invalidateAll();
    jwksServiceInfo = { jwksEndpoint: 'https://remote-service.com/.well_known/jwks' };
    jwtInfo = { accessTokenToValidate: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjR6eTYydXg5VDZUQmJqMkthLVNLWHA2T1NMeTJjMm9FeEFwVzVvMVBlNUEifQ.eyJleHAiOjE2MzkxMDk4ODgsImlzcyI6Imh0dHBzOi8vZXZpZGVuY2UuY2FyZS9hdXRoL3YxIiwianRpIjoiZGRjNjAxNTYtZmNlNy00YThkLWI0N2QtNmEwNWY3OTRhZjE3IiwiYXBwSWQiOiJ0ZXN0LWFwcGxpY2F0aW9uLWNsaWVudC1pZCIsImlhdCI6MTYzOTEwNjI4OH0.oaPE6seAq5ejgXujoy3KAIGPX8XhcPf61U8csu1hXIJ3Vhtchh8ruBLD3qvqQqJ6WtZ1NZ6waQun66W4i9qIxEwdjlLKzbj0cGih3yuZKf5N6XyX-FIxHxjQ-Op1DdJiN1PJkxxLBWogqQdtk9FZqhIcORww1A7MhN4vE3QFJMBR7-ui643kwrmN2fCzaZNWH7WZDiAhJUbjvJp9efXggu7infrPWmuA1I73sId3hiOcncuDW7rWqcN7qF0NwFsoFbUY8oWsqhrcy2RqB3qB6FmUZC2-UYRvCe_Ox3bRcryTRPXxiQL8nK-Z9txZoNoyt-lkWOfi2L8HLXJE6glvRQ' };
    mockJsonWebKeySetResponse = {
      "keys": [
        {
          "kty": "RSA",
          "kid": "4zy62ux9T6TBbj2Ka-SKXp6OSLy2c2oExApW5o1Pe5A",
          "n": "2Pcl5FenO2Pye9e93PPm9qgJMXD7dNek4uVSoY10RmQ2uL9CNJX8CRoMzbpdoU8XwGtH-pYZxbNJAaja4QXa9ROgpougd_4L7YoDe2NqQmb8-2GqfJt1M1_kgOeNxtEDr9YVCLot6Oeu7peAh4hf5rnoMg6YWPTpF265PAxrMyUq_vtVsopihXu6YHLzTMwwP01_Wu8OOfB6A1VrTgC6nnqyANkWvfmY7K_rj9e95Qv04Cq2PHuwJ4-dxMpJteozuaUmpK2x7tEs34VnC9fstwFPk-lrTyM7dBWOH--Aqzy8QFIk8uhEvFxRW0WOIGVLFoIfGA9bKl3xTBFnOyAcqQ",
          "e": "AQAB"
        }
      ]
    };
  });

  describe('Valid token', () => {
    it(`makes a call to JWKS endpoint if it wasn't found in cache`, async () => {
      mockFetch.mockResolvedValue({ status: 200, ok: true, json: () => Promise.resolve(mockJsonWebKeySetResponse) } as Response);

      const _ = await validateAccessTokenUsingJWKS(jwksCache, jwksServiceInfo, jwtInfo, { ignoreExpiration: true });

      expect(mockFetch.mock.calls)
        .toEqual([[
          'https://remote-service.com/.well_known/jwks',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          },
        ]]);
    });

    it(`correctly unwraps and validates the token payload`, async () => {
      mockFetch.mockResolvedValue({ status: 200, ok: true, json: () => Promise.resolve(mockJsonWebKeySetResponse) } as Response);

      const validatedPayload = await validateAccessTokenUsingJWKS(jwksCache, jwksServiceInfo, jwtInfo, { ignoreExpiration: true });

      expect(validatedPayload)
        .toEqual({
          "appId": "test-application-client-id",
          "exp": 1639109888,
          "iat": 1639106288,
          "iss": "https://evidence.care/auth/v1",
          "jti": "ddc60156-fce7-4a8d-b47d-6a05f794af17"
        });
    });

    it(`fails to validate token if no matching key found in JWKS`, async () => {
      const jwks = {
        "keys": [
          {
            "kty": "RSA",
            "kid": "BAD-KEY-ID",
            "n": "2Pcl5FenO2Pye9e93PPm9qgJMXD7dNek4uVSoY10RmQ2uL9CNJX8CRoMzbpdoU8XwGtH-pYZxbNJAaja4QXa9ROgpougd_4L7YoDe2NqQmb8-2GqfJt1M1_kgOeNxtEDr9YVCLot6Oeu7peAh4hf5rnoMg6YWPTpF265PAxrMyUq_vtVsopihXu6YHLzTMwwP01_Wu8OOfB6A1VrTgC6nnqyANkWvfmY7K_rj9e95Qv04Cq2PHuwJ4-dxMpJteozuaUmpK2x7tEs34VnC9fstwFPk-lrTyM7dBWOH--Aqzy8QFIk8uhEvFxRW0WOIGVLFoIfGA9bKl3xTBFnOyAcqQ",
            "e": "AQAB"
          }
        ]
      };

      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        json: () => Promise.resolve(jwks),
      } as Response);

      expect(() => validateAccessTokenUsingJWKS(jwksCache, jwksServiceInfo, jwtInfo, { ignoreExpiration: true }))
        .rejects
        .toThrow(`Unable to find a valid key with id 4zy62ux9T6TBbj2Ka-SKXp6OSLy2c2oExApW5o1Pe5A in the keyset ${JSON.stringify(jwks, null, 2)}.`);
    });

    it(`fails to validate token if could not retrieve JWKS in the first place`, async () => {
      mockFetch.mockResolvedValue({
        status: 500,
        statusText: 'Internal Server Error',
        ok: false,
      } as Response);

      expect(async () => await validateAccessTokenUsingJWKS(jwksCache, jwksServiceInfo, jwtInfo, { ignoreExpiration: true }))
        .rejects
        .toThrow(`500 Internal Server Error
undefined`);
    });

    it(`fails to validate expired token`, async () => {
      mockFetch.mockResolvedValue({ status: 200, ok: true, json: () => Promise.resolve(mockJsonWebKeySetResponse) } as Response);

      expect(async () => await validateAccessTokenUsingJWKS(jwksCache, jwksServiceInfo, jwtInfo, { ignoreExpiration: false }))
        .rejects
        .toThrow(`jwt expired`);
    });
  });

});
