import { Authentication } from "$lib/auth/authservice";
import { getDatabase } from "$lib/db/db";
import { getUserFromToken } from "$lib/db/token";
import { log } from "$lib/logs";
import { json, type RequestHandler } from "@sveltejs/kit";
import { Secret } from "otpauth";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { code } = await request.json();

  const token = cookies.get('token');

  if (!token)
    return json({message: 'Not authenticated'}, {headers: {'Location': '/login'}, status: 302});

  const database = await getDatabase();

  const user = await getUserFromToken(token, true);

  if (!user) {
    log(`2fa attempted with invalid token`, 'WARN');
    return json({message: 'Not authenticated'}, { status: 403 });
  }

  // TOTP
  const secret = Secret.fromBase32(user.totpsecret);
  const totp = Authentication.generateTOTPObject(secret, user);

  // Verify token
  const authenticated = totp.validate({token: code, window: 2});
  
  if (authenticated == null) {
    return json({message: 'Authentication code invalid'}, { status: 403 });
  }

  database.update(({ tokens, users }) => {
    const u = users.find(u => u.id == user.id);
    const t = tokens.find(t => t.content == token);
    if (t) t.authenticated = true
    if (u) u.registered2fa = true;
  });

  log(`Authenticated user ${user.username}`, 'INFO');

  return json({message: 'Authenticated'}, { status: 200 });
}