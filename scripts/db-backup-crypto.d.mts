export function encryptBackup(plaintext: string, env?: NodeJS.ProcessEnv): string;
export function decryptBackup(envelopeText: string, env?: NodeJS.ProcessEnv): string;
export function isEncryptedBackup(value: string): boolean;
