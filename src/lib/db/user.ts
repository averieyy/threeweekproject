export interface User {
  id: number,
  username: string,
  tokens: string[],
  hash: string,
  salt: string,
  totpsecret: string,
}