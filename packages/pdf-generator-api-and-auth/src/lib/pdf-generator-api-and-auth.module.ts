import { HttpModule, HttpService } from "@nestjs/axios";
import { DynamicModule, Module, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { Api, EndpointGetter } from "./api.service";
import { CqrsClient } from "./cqrsClient";
import { JwtStrategy } from "./jwt.strategy";
import { JwtStrategyConfig, JwtStrategyConfigToken } from "./jwtStrategyConfig.service";
import { UseJwtGuard } from "./useJwtGuard";

export type PdfGeneratorApiAndAuthConfiguration<T> = {
    isGlobal?: boolean;
    jwtStrategyConfig: JwtStrategyConfig;
    apiConfiguration: ApiConfiguration<T>;
};

export type ApiConfiguration<T> = {
    getApiEndpoint: EndpointGetter;
    apiClientFactory: (cqrsClient: CqrsClient) => T;
};

@UseJwtGuard()
@Module({})
export class PdfGeneratorApiAndAuthModule {
    static register<T>({
        isGlobal = true,
        jwtStrategyConfig,
        apiConfiguration,
    }: PdfGeneratorApiAndAuthConfiguration<T>): DynamicModule {
        return {
            module: PdfGeneratorApiAndAuthModule,
            global: isGlobal,
            imports: [
                HttpModule.register({
                    responseType: "json",
                }),
            ],
            providers: [
                {
                    provide: JwtStrategyConfigToken,
                    useValue: jwtStrategyConfig,
                },
                {
                    provide: Api,
                    useFactory: (httpService: HttpService, request: Request) =>
                        new Api(httpService, request, apiConfiguration),
                    scope: Scope.REQUEST,
                    inject: [HttpService, REQUEST],
                },
                JwtStrategy,
            ],
            exports: [JwtStrategy, Api],
        };
    }
}
