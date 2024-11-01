import { Authentication } from "$lib/auth/authservice";
import { getDatabase } from "$lib/db/db";
import { getUserFromToken } from "$lib/db/token";
import { type RequestHandler } from "@sveltejs/kit";
import { Secret } from "otpauth";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const respond = (content:object, status: number, headers: HeadersInit = {}) => new Response(JSON.stringify(content), {status, headers});
  
  const { code } = await request.json();

  const token = cookies.get('token');

  if (!token)
    return respond({message: 'Not authenticated'}, 302, {'Location': '/login'});

  const database = await getDatabase();

  const user = await getUserFromToken(token, true);

  if (!user) return respond({message: 'Not authenticated', status: 403}, 403);

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