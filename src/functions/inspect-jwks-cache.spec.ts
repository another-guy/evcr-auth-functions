import { JwksCache } from '../cache';
import { inspectJwksCache } from './inspect-jwks-cache';

describe(inspectJwksCache.name, () => {
  it(`should correctly report inner state as a POJO`, () => {
    const jwksCache = new JwksCache();
    const jwks = { keys: [{ kid: 'key-id', n: '12345678' }] };
    jwksCache.setValue('jwks1', jwks);

    expect(inspectJwksCache(jwksCache)).toEqual({ 'jwks1': jwks });
  });
});
