import { IJsonWebKeySet } from '../functions';

type Key = string;
type Value = IJsonWebKeySet;

export class JwksCache {
  private _innerStorage = new Map<Key, Value>();

  list(): any {
    return Object.fromEntries(this._innerStorage);
  }

  getValue(key: Key): Value | undefined {
    return this._innerStorage.get(key);
  }

  async tryGetValue(key: Key, valueGetter: () => Promise<Value>): Promise<Value> {
    const valueFromStore = this.getValue(key);
    if (valueFromStore) return Promise.resolve(valueFromStore);

    const valueFromSource = await valueGetter();
    this.setValue(key, valueFromSource);
    return Promise.resolve(valueFromSource);
  }

  setValue(key: Key, value: Value): void {
    this._innerStorage.set(key, value);
  }

  invalidateValue(key: Key): void {
    this._innerStorage.delete(key);
  }

  invalidateAll(): void {
    this._innerStorage = new Map<Key, Value>();
  }
}
