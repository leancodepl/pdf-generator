import { HttpModule } from "@nestjs/axios"
import { DynamicModule, Module, ModuleMetadata, NotFoundException, Provider, Type } from "@nestjs/common"
import { CqrsClientFactory } from "./cqrsClientFactory"
import { JwtStrategy, JwtStrategyConfig } from "./jwt.strategy"
import { KratosStrategy, KratosStrategyConfig } from "./kratos.strategy"

export const InstanceToken = Symbol("Instance")
export const ApiAndAuthConfigurationToken = Symbol("ApiAndAuthConfiguration")

export type ApiProxyConfiguration = {
  /**
   * JWT strategy configuration. Optional - only provide if you want to use JWT authentication.
   */
  jwtStrategyConfig?: JwtStrategyConfig
  /**
   * Kratos strategy configuration. Optional - only provide if you want to use Ory Kratos authentication.
   */
  kratosStrategyConfig?: KratosStrategyConfig
}

export type ApiProxySyncConfiguration = ApiProxyConfiguration & {
  isGlobal?: boolean
}

export interface ApiProxyConfigurationFactory {
  createApiProxyConfiguration(): ApiProxyConfiguration | Promise<ApiProxyConfiguration>
}

export interface ApiProxyAsyncConfiguration extends Pick<ModuleMetadata, "imports"> {
  useExisting?: Type<ApiProxyConfigurationFactory>
  useClass?: Type<ApiProxyConfigurationFactory>
  useFactory?: (...args: any[]) => ApiProxyConfiguration | Promise<ApiProxyConfiguration>
  inject?: any[]
  extraProviders?: Provider[]
  isGlobal?: boolean
}

@Module({})
export class ApiProxyModule {
  static register({ isGlobal, jwtStrategyConfig, kratosStrategyConfig }: ApiProxySyncConfiguration): DynamicModule {
    const providers: Provider[] = [CqrsClientFactory]
    const exports: (symbol | Type)[] = [CqrsClientFactory]

    if (jwtStrategyConfig) {
      providers.push({
        provide: JwtStrategy,
        useFactory: () => new JwtStrategy(jwtStrategyConfig),
      })
      exports.push(JwtStrategy)
    }

    if (kratosStrategyConfig) {
      providers.push({
        provide: KratosStrategy,
        useFactory: () => new KratosStrategy(kratosStrategyConfig),
      })
      exports.push(KratosStrategy)
    }

    return {
      module: ApiProxyModule,
      global: isGlobal,
      imports: [
        HttpModule.register({
          responseType: "json",
        }),
      ],
      providers,
      exports,
    }
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
        ...this.createStrategyProviders(),
        CqrsClientFactory,
        ...(options.extraProviders || []),
      ],
      exports: [JwtStrategy, KratosStrategy, CqrsClientFactory],
    }
  }

  private static createStrategyProviders(): Provider[] {
    return [
      {
        provide: JwtStrategy,
        useFactory: (config: ApiProxyConfiguration) => {
          if (config.jwtStrategyConfig) {
            return new JwtStrategy(config.jwtStrategyConfig)
          }
          return null
        },
        inject: [ApiAndAuthConfigurationToken],
      },
      {
        provide: KratosStrategy,
        useFactory: (config: ApiProxyConfiguration) => {
          if (config.kratosStrategyConfig) {
            return new KratosStrategy(config.kratosStrategyConfig)
          }
          return null
        },
        inject: [ApiAndAuthConfigurationToken],
      },
    ]
  }

  private static createAsyncProviders(options: ApiProxyAsyncConfiguration): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    if (!options.useClass) {
      throw new NotFoundException("Options have to have one of useClass, useExisting, useFactory")
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ]
  }

  private static createAsyncOptionsProvider(options: ApiProxyAsyncConfiguration): Provider {
    if (options.useFactory) {
      return {
        provide: ApiAndAuthConfigurationToken,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    if (options.useExisting === undefined && options.useClass === undefined) {
      throw new NotFoundException("Options have to have one of useClass, useExisting, useFactory")
    }

    return {
      provide: ApiAndAuthConfigurationToken,
      useFactory: (optionsFactory: ApiProxyConfigurationFactory) => optionsFactory.createApiProxyConfiguration(),
      inject: [this.getInjectOption(options)],
    }
  }

  private static getInjectOption(options: ApiProxyAsyncConfiguration) {
    if (options.useExisting) return options.useExisting
    if (options.useClass) return options.useClass
    throw new NotFoundException("Options have to have one of useClass, useExisting, useFactory")
  }
}
