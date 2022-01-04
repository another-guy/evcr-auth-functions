import { JwksCache } from '../cache';

export function inspectJwksCache(jwksCache: JwksCache): any {
  return jwksCache.list();
}
