import { IJsonWebKeySet } from '..';
import { JwksCache } from './jwks-cache';

function createJwks(kid: string, n: string): IJsonWebKeySet {
  return {
    keys: [{ kid, n }],
  };
}

describe(JwksCache.name, () => {
  let jwksCache: JwksCache;

  beforeEach(() => {
    jwksCache = new JwksCache();
  });

  it(`list() reports {} for empty cache`, () => {
    expect(jwksCache.list()).toEqual({});
  });

  it(`list() reports the JWKS`, () => {
    jwksCache.setValue('jwks1', createJwks('key-1', 'abcdef'));
    jwksCache.setValue('jwks2', createJwks('key-2', 'ABCDEF'));

    expect(jwksCache.list())
      .toEqual({
        'jwks1': { keys: [{ kid: 'key-1', n: 'abcdef' }] },
        'jwks2': { keys: [{ kid: 'key-2', n: 'ABCDEF' }] },
      });
  });

  it(`getValue() to report same object that was cached using setValue()`, () => {
    const jwks1 = createJwks('key', '12345678');
    jwksCache.setValue('jwks1', jwks1);

    expect(jwksCache.getValue('jwks1')).toBe(jwks1);
  });

  it(`getValue() to report same object that was cached using tryGetValue()`, async () => {
    const jwks1 = createJwks('key', '12345678');

    const _ = await jwksCache.tryGetValue('jwks1', () => Promise.resolve(jwks1));

    expect(jwksCache.getValue('jwks1')).toBe(jwks1);
  });

  it(`tryGetValue() to return same object as from the Promise when no cached value found for the key`, async () => {
    const jwks1 = createJwks('key', '12345678');

    const cachedValue = await jwksCache.tryGetValue('jwks1', () => Promise.resolve(jwks1));

    expect(cachedValue).toEqual(jwks1);
  });

  it(`tryGetValue() to return the cached value when key is found`, async () => {
    const jwks1 = createJwks('key', '12345678');
    jwksCache.setValue('jwks1', jwks1);

    const cachedValue = await jwksCache.tryGetValue('jwks1', () => Promise.reject(`This is not expected.`));

    expect(cachedValue).toEqual(jwks1);
  });

  it(`invalidateAll() clears out all cached key/value entries`, () => {
    jwksCache.setValue('key1', createJwks('jwks1', '12345678'));

    jwksCache.invalidateAll();

    expect(jwksCache.list()).toEqual({});
  });

  it(`invalidateValue() ONLY clears out that specific cached key/value entry`, () => {
    const jwks2 = createJwks('jwks2', '12345678');
    jwksCache.setValue('key1', createJwks('jwks1', '12345678'));
    jwksCache.setValue('key2', jwks2);

    jwksCache.invalidateValue('key1');

    expect(jwksCache.list()).toEqual({ key2: jwks2 });
  });
});
