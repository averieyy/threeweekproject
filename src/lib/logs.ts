import { createWriteStream } from 'fs';

const fileStream = createWriteStream('./logs.txt', {
  encoding: 'utf8'
});

export function log(message: string, type: 'WARN' | 'INFO' | 'ERR') {
  const now = new Date();

  const fullmessage=`[${[now.getHours(), now.getMinutes(), now.getSeconds()].map(n => n.toString().padStart(2,'0')).join(':')}] ${type.padStart(4, ' ')}: ${message}`;

  console.log(fullmessage);
  fileStream.write(fullmessage + '\n');
}