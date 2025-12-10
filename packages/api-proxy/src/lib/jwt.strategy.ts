import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { VerifyOptions } from "jsonwebtoken"
import { passportJwtSecret } from "jwks-rsa"
import { ExtractJwt, Strategy, StrategyOptions, VerifyCallbackWithRequest } from "passport-jwt"

const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken()

export type JwtStrategyConfig = {
  jwksUri: string
  jsonWebTokenOptions?: VerifyOptions
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(jwtStrategyConfig: JwtStrategyConfig) {
    const jwksUri = jwtStrategyConfig.jwksUri

    const strategyOptions: StrategyOptions = {
      jwtFromRequest: tokenExtractor,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
      passReqToCallback: true,
      jsonWebTokenOptions: jwtStrategyConfig.jsonWebTokenOptions,
    }

    super(strategyOptions)
  }

  validate(...[req, payload]: Parameters<VerifyCallbackWithRequest>) {
    return {
      payload,
      token: tokenExtractor(req),
    }
  }
}
