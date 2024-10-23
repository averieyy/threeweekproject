import { createHash } from 'crypto';

const hash = createHash('sha256');

hash.update('test');
console.log(hash.digest('hex'));