import { getDatabase } from "./db";
import { randomBytes } from 'crypto';
import type { User } from "./user";

export const TOKENVALID = 1000 * 60 * 60 * 24; // Amount of time a token should be considered valid (in milliseconds)

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

export async function getUserFromToken (token: string, allowUnauthorized=false): Promise<User | null> {
  const database = await getDatabase();

  const { tokens, users } = database.data;

  const tokenobj = tokens.find(t => t.content === token);
  
  if (!tokenobj || (!allowUnauthorized && !tokenobj.authenticated)) return null;

  database.update(({ tokens }) => {
    const now = new Date();

    for (let token of tokens) {
      if (now.getTime() - new Date(token.lastused).getTime() > TOKENVALID)
        tokens.splice(tokens.indexOf(token),1);
    }

    const t = tokens.find(t => t == tokenobj);
    if (t) t.lastused = now;

  });

  const user = users.find(u => u.id == tokenobj.userid);

  return user || null;
}