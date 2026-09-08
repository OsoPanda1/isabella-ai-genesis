type HashLike = { update: (value: string | Uint8Array) => HashLike; digest: (encoding?: string) => string | Uint8Array };

const unsupported = (name: string): never => {
  throw new Error(`${name} is server-only and cannot run in the browser.`);
};

export const randomUUID = (): string => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const value = Math.random() * 16;
    const digit = character === "x" ? value : (value & 0x3) | 0x8;
    return Math.floor(digit).toString(16);
  });
};

export const randomBytes = (size: number): Uint8Array => {
  const bytes = new Uint8Array(size);
  globalThis.crypto?.getRandomValues(bytes);
  return bytes;
};

export const createHash = (): HashLike => unsupported("createHash");
export const createHmac = (): HashLike => unsupported("createHmac");
export const createSign = (): never => unsupported("createSign");
export const createVerify = (): never => unsupported("createVerify");
export const createPublicKey = (): never => unsupported("createPublicKey");
export const generateKeyPairSync = (): never => unsupported("generateKeyPairSync");
export const createCipheriv = (): never => unsupported("createCipheriv");
export const createDecipheriv = (): never => unsupported("createDecipheriv");
export const hkdfSync = (): never => unsupported("hkdfSync");
export const sign = (): never => unsupported("sign");
export const verify = (): never => unsupported("verify");
export const timingSafeEqual = (left: Uint8Array, right: Uint8Array): boolean => {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
};

export class KeyObject {}
