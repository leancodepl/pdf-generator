import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy, StrategyOptions, VerifyCallbackWithRequest } from "passport-jwt";
import { JwtStrategyConfig } from "./jwtStrategyConfig.service";

export const JwtStrategyToken = Symbol("JwtStrategy");

const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(jwtStrategyConfig: JwtStrategyConfig) {
        const jwksUri = jwtStrategyConfig.jwksUri;

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
        };

        super(strategyOptions);
    }

    validate(...[req]: Parameters<VerifyCallbackWithRequest>) {
        return {
            token: tokenExtractor(req),
        };
    }
}
