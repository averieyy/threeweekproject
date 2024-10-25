import { Authentication } from "$lib/auth/authservice";
import { genSalt, hashPassword } from "$lib/auth/hasher";
import { getDatabase } from "$lib/db/db";
import type { User } from "$lib/db/user";
import type { RequestHandler } from "@sveltejs/kit";

// Ethically sourced from https://emailregex.com
const EMAILREGEX = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);

export const POST: RequestHandler = async ({cookies, request}) => {
  const respond = (content: object, status: number = 200, ) => new Response(JSON.stringify(content), { status });

  const { email, password, username } : { email: string, password: string, username: string } = await request.json();
  
  const database = await getDatabase();
  const { users } = database.data;
  
  // Check username, password and email for errors
  if (password.length < 8) return respond({message: 'Password too short'}, 400);
  if (!email.match(EMAILREGEX)) return respond({message: 'Invalid email address'}, 400);
  if (users.find(u => u.email == email)) return respond({message: 'Email already in use'}, 400);
  if (users.find(u => u.username == username)) return respond({message: 'Username already in use'}, 400);

  // Create user
  let id: number | undefined = undefined;

  while (!id || users.find(u => u.id == id))
    id = Math.floor(Math.random() * 0xffffff);

  const totpsecret = Authentication.generateSecret();

  const salt = genSalt();
  const hash = hashPassword(salt, password);

  const user: User = {id, email, username, totpsecret: totpsecret.base32, salt, hash};

  database.update(({ users }) => users.push(user));

  return respond({code: 302, 'location': '2fa'});
}