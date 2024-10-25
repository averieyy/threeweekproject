import { createHash, randomBytes } from 'crypto';

export function hashPassword (salt: string, password: string) : string {
  const hash = createHash('sha256');

  hash.update(salt + password);
  return hash.digest('base64');
}

export function genSalt() : string {
  return randomBytes(16).toString('base64');
}