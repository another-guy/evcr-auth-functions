import jsonwebtoken from 'jsonwebtoken';
import { IKeyPair } from '../types';

export async function generateJwt(
  keyPair: IKeyPair,
  payload: any,
  ttlInSeconds = 3600,
): Promise<string> {
  const iat = Math.trunc(Date.now() / 1000);
  const tokenLifeDurationInSeconds = ttlInSeconds;
  const exp = iat + tokenLifeDurationInSeconds;

  const jwt = jsonwebtoken.sign(
    {
      ...payload,
      exp,
    },
    keyPair.privateKey,
    {
      algorithm: 'RS256',
      keyid: keyPair.id,
    },
  );
  return Promise.resolve(jwt);
}
