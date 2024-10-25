import { getDatabase } from "./db";
import { randomBytes } from 'crypto';

export interface token {
  content: string,
  userid: number,
  authenticated: boolean,
  lastused: Date,
}

export async function genToken() : Promise<string> {
  const database = await getDatabase();
  const { tokens } = database.data;

  let token : string | undefined = undefined;

  while (!token || tokens.find(t => t.content == token)) {
    token = randomBytes(16).toString('base64');
  }

  return token;
}