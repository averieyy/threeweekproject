import { Authentication } from "$lib/auth/authservice";
import { getDatabase } from "$lib/db/db";
import { type RequestHandler } from "@sveltejs/kit";
import { Secret } from "otpauth";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const respond = (content:object, status: number, headers: HeadersInit = {}) => new Response(JSON.stringify(content), {status, headers});
  
  const { code } = await request.json();

  const token = cookies.get('token');

  if (!token)
    return respond({message: 'Not authenticated'}, 302, {'Location': '/login'});

  // Connect to database
  const database = await getDatabase();

  const { users, tokens } = database.data;

  const tokenobj = tokens.find(t => t.content == token);
  if (!tokenobj) return respond({message: 'Not authenticated'}, 302, {'Location': '/login'});

  // Get user by token
  const user = users.find(u => u.id == tokenobj.userid);

  if (!user) return respond({message: 'Not authenticated'}, 302, {'Location': '/login'});

  // TOTP
  const secret = Secret.fromBase32(user.totpsecret);
  const totp = Authentication.generateTOTPObject(secret);

  // Verify token
  const authenticated = totp.validate({token: code, window: 2});
  
  if (authenticated == null) {
    return respond({message: 'Authentication code invalid'}, 403);
  }

  database.update(({ tokens }) => {
    let t = tokens.find(t => t.content == token);
    if (t) t.authenticated = true
  });

  return respond({message: 'Authenticated'}, 200);
}