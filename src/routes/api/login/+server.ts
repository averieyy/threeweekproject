import type { RequestHandler } from "@sveltejs/kit";
import { createTestAccount, createTransport } from 'nodemailer';
import 'dotenv/config';
import { TOTP } from 'otpauth';

const testaccount = await createTestAccount();

const transport = createTransport({
  host: process.env.EMAILHOST,
  port: parseInt(process.env.EMAILPORT || '587') || 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS,
  }
});

export const POST: RequestHandler = async ({ cookies, request }) => {
  const respond = (data:object, status: number = 200) => new Response(JSON.stringify(data), { status });

  const { email, password, username } : { email: string, password: string, username: string } = await request.json();

  if (!email || !password) return respond({message: 'Email or password missing'}, 400);

  const token = Math.floor(Math.random() * 1000000);

  transport.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: `2FA - ${username}`,
    text: `Your 2FA token is ${token.toString().padStart(6,'0')}`
  });

  return new Response('', {status: 302, headers: {
    'Location': '/2fa'
  }});
}