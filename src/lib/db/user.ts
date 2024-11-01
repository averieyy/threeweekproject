import type { token } from "./token";

export interface User {
  id: number,
  username: string,
  hash: string,
  salt: string,
  totpsecret: string,
  email: string,
  registered2fa: boolean,
}