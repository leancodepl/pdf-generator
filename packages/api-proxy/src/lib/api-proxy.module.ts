import { CqrsClientFactory } from "@leancodepl/api-proxy";
import { HttpModule } from "@nestjs/axios";
import { DynamicModule, Module, ModuleMetadata, NotFoundException, Provider, Type } from "@nestjs/common";
import { JwtStrategy, JwtStrategyConfig } from "./jwt.strategy";
import { UseJwtGuard } from "./useJwtGuard";

export const InstanceToken = Symbol("Instance");
export const ApiAndAuthConfigurationToken = Symbol("ApiAndAuthConfiguration");

export type ApiProxyConfiguration = {
    jwtStrategyConfig: JwtStrategyConfig;
};

export type ApiProxySyncConfiguration = {
    isGlobal?: boolean;
} & ApiProxyConfiguration;

export interface ApiProxyConfigurationFactory {
    createApiProxyConfiguration(): Promise<ApiProxyConfiguration> | ApiProxyConfiguration;
}

export interface ApiProxyAsyncConfiguration extends Pick<ModuleMetadata, "imports"> {
    useExisting?: Type<ApiProxyConfigurationFactory>;
    useClass?: Type<ApiProxyConfigurationFactory>;
    useFactory?: (...args: any[]) => Promise<ApiProxyConfiguration> | ApiProxyConfiguration;
    inject?: any[];
    extraProviders?: Provider[];
    isGlobal?: boolean;
}

@UseJwtGuard()
@Module({})
export class ApiProxyModule {
    static register({ isGlobal, jwtStrategyConfig }: ApiProxySyncConfiguration): DynamicModule {
        return {
            module: ApiProxyModule,
            global: isGlobal,
            imports: [
                HttpModule.register({
                    responseType: "json",
                }),
            ],
            providers: [
                {
                    provide: JwtStrategy,
                    useFactory: () => new JwtStrategy(jwtStrategyConfig),
                },
                CqrsClientFactory,
            ],
            exports: [JwtStrategy, CqrsClientFactory],
        };
    }

    static registerAsync(options: ApiProxyAsyncConfiguration): DynamicModule {
        return {
            module: ApiProxyModule,
            global: options.isGlobal,
            imports: [
                HttpModule.register({
                    responseType: "json",
                }),
                ...(options.imports ?? []),
            ],
            providers: [
                ...this.createAsyncProviders(options),
                {
                    provide: JwtStrategy,
                    useFactory: (config: ApiProxyConfiguration) => new JwtStrategy(config.jwtStrategyConfig),
                    inject: [ApiAndAuthConfigurationToken],
                },
                CqrsClientFactory,
                ...(options.extraProviders || []),
            ],
            exports: [JwtStrategy, CqrsClientFactory],
        };
    }

    private static createAsyncProviders(options: ApiProxyAsyncConfiguration): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }

        if (!options.useClass)
            throw new NotFoundException("Options have to have one of useClass, useExisting, useFactory");

        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }

    private static createAsyncOptionsProvider(options: ApiProxyAsyncConfiguration): Provider {
        if (options.useFactory) {
            return {
                provide: ApiAndAuthConfigurationToken,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        if (options.useExisting === undefined && options.useClass === undefined)
            throw new NotFoundException("Options have to have one of useClass, useExisting, useFactory");

        return {
            provide: ApiAndAuthConfigurationToken,
            useFactory: (optionsFactory: ApiProxyConfigurationFactory) => optionsFactory.createApiProxyConfiguration(),
            inject: [this.getInjectOption(options)],
        };
    }

    private static getInjectOption(options: ApiProxyAsyncConfiguration) {
        if (options.useExisting) return options.useExisting;
        if (options.useClass) return options.useClass;
        throw new NotFoundException("Options have to have one of useClass, useExisting, useFactory");
    }
}
