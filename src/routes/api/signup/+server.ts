import { Authentication } from "$lib/auth/authservice";
import { genSalt, hashPassword } from "$lib/auth/hasher";
import { getDatabase } from "$lib/db/db";
import { genToken, TOKENVALID, type token } from "$lib/db/token";
import type { User } from "$lib/db/user";
import { log } from "$lib/logs";
import { json, type RequestHandler } from "@sveltejs/kit";

// Ethically sourced from https://emailregex.com
const EMAILREGEX = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);

export const POST: RequestHandler = async ({cookies, request}) => {

  const { email, password, username } : { email: string, password: string, username: string } = await request.json();
  
  const database = await getDatabase();
  const { users } = database.data;
  
  // Check username, password and email for errors
  if (password.length < 8) return json({message: 'Password too short'}, { status: 400 });
  if (!email.match(EMAILREGEX)) return json({message: 'Invalid email address'}, { status: 400 });
  if (users.find(u => u.email == email)) return json({message: 'Email already in use'}, { status: 400 });
  if (users.find(u => u.username == username)) return json({message: 'Username already in use'}, { status: 400 });

  // Create user
  let id: number | undefined = undefined;

  while (!id || users.find(u => u.id == id))
    id = Math.floor(Math.random() * 0xffffff);

  const totpsecret = Authentication.generateSecret();

  const salt = genSalt();
  const hash = hashPassword(salt, password);

  const user: User = {id, email, username, totpsecret: totpsecret.base32, salt, hash, registered2fa: false};

  const token : token = {content: await genToken(), authenticated: false, userid: user.id, lastused: new Date()};       

  cookies.set('token', token.content, {path: '/', secure: false, maxAge: TOKENVALID});

  database.update(({ users }) => users.push(user));
  database.update(({ tokens }) => tokens.push(token));

  log(`Created new user ${user.username}`, 'INFO');

  return json({code: 302, 'Location': '2fa'});
}