import { TOTP, Secret } from 'otpauth';

export class Authentication {
  public static generateSecret () {
    return new Secret({size: 16});
  }

  public static generateTOTPObject (secret: Secret) {
    return new TOTP({
      issuer: 'averieyy not INC',
      label: 'Game server',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });
  }

  public static validateToken (secret: Secret, token: string) {
    this.generateTOTPObject(secret).validate({ token, window: 1 });
  }
}