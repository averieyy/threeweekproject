import type { User } from '$lib/db/user';
import { TOTP, Secret } from 'otpauth';

export class Authentication {
  public static generateSecret () {
    return new Secret({size: 16});
  }

  public static generateTOTPObject (secret: Secret, user: User) {
    return new TOTP({
      issuer: 'Game server',
      label: user.username,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });
  }

  public static validateToken (secret: Secret, token: string, user: User) {
    this.generateTOTPObject(secret, user).validate({ token, window: 1 });
  }
}