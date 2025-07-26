import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from '../config';
import { AuthenticatedUserPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${envs.auth0UrlDomain}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: envs.auth0UserTokenAudience, //process.env.AUTH0_MGMT_AUDIENCE,
      issuer: envs.auth0UserTokenIssuer, //`${process.env.AUTH0_URL_DOMAIN}`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: { email: string; sub: string }): AuthenticatedUserPayload {
    return {
      email: payload.email,
      auth0Id: payload.sub,
    };
  }
}
