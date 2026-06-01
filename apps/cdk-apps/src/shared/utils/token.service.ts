import { JwtHeader, sign } from 'jsonwebtoken';

export function generateToken() {
  const header: JwtHeader = {
    kid: process.env.evFreaksApiKid,
    typ: 'JWT',
    alg: 'ES256',
  };

  const payload = {
    iss: 'https://github.com/ev-freaks/chargev-io-jwtauth',
    iat: Math.round(Date.now() / 1000),
    exp: Math.round((Date.now() / 1000) + 7200),
    ckuid: '_1234567890'
  };

  const pem: string = process.env.evFreaksApiPem!.replace(/\\n/g, '\n');

  return sign(payload, pem, { header });
}
