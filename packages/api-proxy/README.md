# api-proxy

Handles authentication and communication with a [contractsgenerator](https://github.com/leancodepl/contractsgenerator)-based API. Supports JWT (e.g. JWKS) and [Ory Kratos](https://www.ory.sh/docs/kratos) session validation (cookie or Bearer token).

## Installation

```bash
npm install @leancodepl/api-proxy
```

## API

### `ApiProxyModule.register(config)`

Registers the API proxy module with synchronous configuration.

- **Parameters**
  - `config: ApiProxySyncConfiguration` – Synchronous module configuration
    - `isGlobal?: boolean` – Register the module globally
    - `jwtStrategyConfig?: JwtStrategyConfig` – Enable JWT (JWKS) authentication
    - `kratosStrategyConfig?: KratosStrategyConfig` – Enable Ory Kratos authentication
- **Returns**
  - `DynamicModule` – NestJS dynamic module

### `ApiProxyModule.registerAsync(options)`

Registers the API proxy module with asynchronous configuration. Behavior matches Nest custom providers; one of `useClass`, `useExisting`, or `useFactory` is required.

- **Parameters**
  - `options: ApiProxyAsyncConfiguration` – Async module configuration (extends `Pick<ModuleMetadata, "imports">`)
    - `imports?: ModuleMetadata["imports"]` – Modules to import
    - `useExisting?: Type<ApiProxyConfigurationFactory>` – Use existing configuration factory
    - `useClass?: Type<ApiProxyConfigurationFactory>` – Use class as configuration factory
    - `useFactory?: (...args: any[]) => ApiProxyConfiguration | Promise<ApiProxyConfiguration>` – Factory function
    - `inject?: any[]` – Tokens to inject into the factory
    - `extraProviders?: Provider[]` – Additional providers
    - `isGlobal?: boolean` – Register the module globally
- **Returns**
  - `DynamicModule` – NestJS dynamic module
- **Throws**
  - `NotFoundException` – When none of `useClass`, `useExisting`, or `useFactory` is specified

### `UseJwtGuard()`

Returns a guard that applies JWT (Passport) authentication. Use on controllers when `defaultStrategy` is `"jwt"` or pass the strategy explicitly.

- **Returns**
  - Decorator that applies `AuthGuard("jwt")`

### `UseKratosGuard()`

Returns a guard that applies Ory Kratos (Passport) authentication. Validates via Kratos `toSession` (cookie or `Authorization: Bearer <session_token>`). Use on controllers when `defaultStrategy` is `"kratos"` or pass the strategy explicitly.

- **Returns**
  - Decorator that applies `AuthGuard("kratos")`

### `CqrsClientFactory`

Injectable factory that creates a CQRS API client bound to the current request (for token forwarding).

- **Constructor**
  - `httpService: HttpService` – From `"@nestjs/axios"`
  - `request: Request` – Current request (injected via `REQUEST`)
- **Methods**
  - `create(getApiEndpoint)` – Returns an `Api` instance using the given endpoint getter
    - **Parameters**
      - `getApiEndpoint: EndpointGetter` – Function that returns the API base URL for a given type
    - **Returns**
      - `CqrsClient` – API client instance

### `Api`

Implements `CqrsClient`. Sends requests to the API using the request’s auth token.

- **Constructor**
  - `httpService: HttpService` – HTTP service instance
  - `request: Request` – Current request
  - `getApiEndpoint: EndpointGetter` – Function that returns the API base URL for a given type
- **Methods**
  - `createQuery<TQuery, TResult>(type)` – Returns a function that runs a query
    - **Parameters**
      - `type: string` – Query type (used to resolve endpoint)
    - **Returns**
      - `(dto: TQuery) => Promise<TResult>`
  - `createCommand<TCommand, TErrorCodes>(type)` – Returns a function that runs a command
    - **Parameters**
      - `type: string` – Command type (used to resolve endpoint)
    - **Returns**
      - `(dto: TCommand) => Promise<CommandResult<TErrorCodes>>`

### `CqrsClient`

Interface for CQRS API clients: `createQuery(type)` and `createCommand(type)`.

### `EndpointGetter`

Type: `(type: string) => string`. Function that returns the API base URL for a given `type`.

### `JwtStrategy`

Passport strategy for JWT (JWKS) authentication.

- **Constructor**
  - `jwtStrategyConfig: JwtStrategyConfig` – JWT strategy configuration
    - `jwksUri: string` – JWKS endpoint URL
    - `jsonWebTokenOptions?: VerifyOptions` – Options from `"jsonwebtoken"` (e.g. `audience`, `issuer`)

### `KratosStrategy`

Passport strategy for Ory Kratos session validation (cookie or Bearer token).

- **Constructor**
  - `kratosStrategyConfig: KratosStrategyConfig` – Kratos strategy configuration
    - `kratosPublicUrl: string` – Ory Kratos public API base URL (e.g. `http://localhost:4433`)

### Types

- **`ApiProxySyncConfiguration`** – `ApiProxyConfiguration & { isGlobal?: boolean }`
- **`ApiProxyConfiguration`** – `{ jwtStrategyConfig?: JwtStrategyConfig; kratosStrategyConfig?: KratosStrategyConfig }`
- **`ApiProxyAsyncConfiguration`** – Async module options (see `registerAsync`)
- **`ApiProxyConfigurationFactory`** – `{ createApiProxyConfiguration(): ApiProxyConfiguration | Promise<ApiProxyConfiguration> }`
- **`JwtStrategyConfig`** – `{ jwksUri: string; jsonWebTokenOptions?: VerifyOptions }` (`VerifyOptions` from `"jsonwebtoken"`)
- **`KratosStrategyConfig`** – `{ kratosPublicUrl: string }` (Ory Kratos public API base URL)
- **`KratosUser`** – `{ session: Session; sessionToken?: string }` (from `@ory/client`)

### Symbols

- **`InstanceToken`** – Injection token for the proxy instance
- **`ApiAndAuthConfigurationToken`** – Injection token for API/auth configuration

## Usage Examples

### Register module (sync, JWT)

```ts
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ApiProxyModule } from "@leancodepl/api-proxy";

const config = {
  isGlobal: false,
  jwtStrategyConfig: {
    jwksUri: "https://localhost:3333/auth/.well-known/openid-configuration/jwks",
    jsonWebTokenOptions: { audience: "internal_api" },
  },
};

@Module({
  imports: [
    ApiProxyModule.register(config),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
})
export class AppModule {}
```

### Register module (sync, Kratos)

```ts
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ApiProxyModule } from "@leancodepl/api-proxy";

@Module({
  imports: [
    ApiProxyModule.register({
      isGlobal: false,
      kratosStrategyConfig: { kratosPublicUrl: "http://localhost:4433" },
    }),
    PassportModule.register({ defaultStrategy: "kratos" }),
  ],
})
export class AppModule {}
```

### Register module (async, with ConfigService)

```ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { ApiProxyModule } from "@leancodepl/api-proxy";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApiProxyModule.registerAsync({
      isGlobal: false,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        jwtStrategyConfig: {
          jwksUri: config.get("JWKS_URI") ?? "",
          jsonWebTokenOptions: { audience: "internal_api" },
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
})
export class AppModule {}
```

### Use JWT guard on a controller

```ts
import { Controller } from "@nestjs/common";
import { UseJwtGuard } from "@leancodepl/api-proxy";

@UseJwtGuard()
@Controller()
export class AppController {}
```

### Use Kratos guard on a controller

```ts
import { Controller } from "@nestjs/common";
import { UseKratosGuard } from "@leancodepl/api-proxy";

@UseKratosGuard()
@Controller("kratos")
export class KratosController {}
```

### Provide a CQRS client and use it

```ts
import { Injectable, Module } from "@nestjs/common";
import { ApiProxyModule, CqrsClientFactory } from "@leancodepl/api-proxy";
import { PassportModule } from "@nestjs/passport";
import Client from "./Client"; // from contractsgenerator-typescript

@Injectable()
export class CqrsClient1 {
  client;
  constructor(cqrsClientFactory: CqrsClientFactory) {
    this.client = Client(cqrsClientFactory.create((type) => `http://localhost:3333/api/${type}`));
  }
}

@Module({
  imports: [
    ApiProxyModule.register({ jwtStrategyConfig: { jwksUri: "https://..." } }),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [CqrsClient1],
})
export class AppModule {}
```

## Configuration

- **JWT:** Set `jwksUri` and optionally `jsonWebTokenOptions` (e.g. `audience`, `issuer`) from `"jsonwebtoken"` `VerifyOptions`.
- **Kratos:** Set `kratosPublicUrl` to your Kratos public API base (e.g. `http://localhost:4433`). The strategy uses the Kratos `toSession` API with cookie or `Authorization: Bearer <session_token>`.
