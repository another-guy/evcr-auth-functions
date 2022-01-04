import { JwksCache } from '../cache';

export function invalidateJwksCache(jwksCache: JwksCache, jwksUrl?: string): void {
  if (jwksUrl)
    jwksCache.invalidateValue(jwksUrl);
  else
    jwksCache.invalidateAll();
}
