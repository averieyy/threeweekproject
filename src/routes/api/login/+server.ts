import { json, type RequestHandler } from "@sveltejs/kit";
import { getDatabase } from "$lib/db/db";
import { hashPassword } from "$lib/auth/hasher";
import { genToken, TOKENVALID } from "$lib/db/token";
import type { token } from "$lib/db/token";

// const testaccount = await createTestAccount();

// const transport = createTransport({
//   host: process.env.EMAILHOST,
//   port: parseInt(process.env.EMAILPORT || '587') || 587,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAILPASS,
//   }
// });

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { email, password, username } : { email: string, password: string, username: string } = await request.json();

  const database = await getDatabase();
  const { users } = database.data;

  let loggedin = false;

  for (const user of users) {
    if (user.username == username && user.email == email) {
      // Check if password matches
      const hash = hashPassword(user.salt, password);
      if (hash !== user.hash) break; // Break because no emails should be the same

      const token : token = {content: await genToken(), authenticated: false, userid: user.id, lastused: new Date()};       

      database.update(({ tokens }) => tokens.push(token));

      cookies.set('token', token.content, {path: '/', secure: false, maxAge: TOKENVALID});
      loggedin = true;
    }
  }

  if (loggedin)
    return json({message: 'Authenticated'}, {status: 200});
  
  return json({message: 'User not found'}, { status: 404 });
}