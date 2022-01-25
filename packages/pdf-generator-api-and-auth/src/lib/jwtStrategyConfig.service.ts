import { Inject, Injectable } from "@nestjs/common";
import { VerifyOptions } from "jsonwebtoken";

export type JwtStrategyConfig = {
    jwksUri: string;
    jsonWebTokenOptions?: VerifyOptions;
};

export const JwtStrategyConfigToken = Symbol("JwtStrategyConfig");

@Injectable()
export class ApiBase {
    constructor(@Inject(JwtStrategyConfigToken) private readonly jwtStrategyConfig: JwtStrategyConfig) {}

    getJwtStrategyConfig(): JwtStrategyConfig {
        return this.jwtStrategyConfig;
    }
}
