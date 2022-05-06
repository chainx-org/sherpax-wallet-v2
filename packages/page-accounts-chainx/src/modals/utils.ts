
import { mnemonicToSeed } from 'bip39';
import { bufferToU8a, u8aToHex, isHex, stringToU8a, hexToU8a, u8aToString } from '@polkadot/util';
import { naclKeypairFromSeed, mnemonicToMiniSecret } from '@polkadot/util-crypto';
import { bip39ToSeed, isReady } from '@polkadot/wasm-crypto';

/**
 * @name toSeed
 * @summary Creates a valid seed from a mnemonic input
 * @example
 * <BR>
 *
 * ```javascript
 * import { mnemonicGenerate, mnemonicToSeed, mnemonicValidate } from '@polkadot/util-crypto';
 *
 * const mnemonic = mnemonicGenerate(); // => string
 * const isValidMnemonic = mnemonicValidate(mnemonic); // => boolean
 *
 * if (isValidMnemonic) {
 *   console.log(`Seed generated from mnemonic: ${mnemonicToSeed(mnemonic)}`); => u8a
 * }
 * ```
 */
export function MnemonictoSeedV1(mnemonic: string, password = ''): string {
  const seedLike = isReady()
    ? bip39ToSeed(mnemonic.trim(), password)
    : bufferToU8a(mnemonicToSeed(mnemonic.trim(), password)).subarray(0, 32);

  const seedU8a =
    typeof seedLike === 'string' && !isHex(seedLike, 256)
      ? u8aFrom(seedLike.padEnd(32, ' '), 'utf8')
      : u8aFrom(seedLike, 'hex');

  const seed = naclKeypairFromSeed(seedU8a).secretKey.subarray(0, 32);

  return u8aToHex(seed);
}

export function u8aFrom(value, stringEncoding) {
  if (!value) {
    return new Uint8Array(0);
  }

  if (Buffer.isBuffer(value)) {
    return bufferToU8a(value);
  }

  if (typeof value === 'string') {
    let stringIsHex = false;

    if (stringEncoding && stringEncoding === 'hex') {
      stringIsHex = true;
    } else if (stringEncoding && ~['utf8', 'utf-8'].indexOf('utf8')) {
      stringIsHex = false;
    } else if (isHex(value)) {
      stringIsHex = true;
    }

    if (stringIsHex) {
      return hexToU8a(value);
    }

    return stringToU8a(value);
  }

  if (Array.isArray(value)) {
    return Uint8Array.from(value);
  }

  return value;
}
