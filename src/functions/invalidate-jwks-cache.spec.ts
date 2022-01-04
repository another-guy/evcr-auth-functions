import { JwksCache } from '../cache';
import { invalidateJwksCache } from './invalidate-jwks-cache';

const jwks2 = { keys: [{ kid: 'key-id-2', n: 'abcdefgh' }] };

describe(invalidateJwksCache.name, () => {
  let jwksCache: JwksCache;

  beforeEach(() => {
    jwksCache = new JwksCache();
    jwksCache.setValue('jwks1', { keys: [{ kid: 'key-id-1', n: '12345678' }] });
    jwksCache.setValue('jwks2', jwks2);
  });

  it(`should correctly invalidate (clear out) all entries when key is not provided`, () => {
    invalidateJwksCache(jwksCache);

    expect(jwksCache.list()).toEqual({});
  });

  it(`should correctly invalidate (clear out) specific entry when key is provided`, () => {
    invalidateJwksCache(jwksCache, 'jwks1');

    expect(jwksCache.list()).toEqual({ jwks2 });
  });
});
