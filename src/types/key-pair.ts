import { IPrivateKeyContainer } from './private-key-container';
import { IPublicKeyContainer } from './public-key-container';

export interface IKeyPair extends IPublicKeyContainer, IPrivateKeyContainer {
  id: string;
}
