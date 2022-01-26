# api-proxy

Used for authentication and communication with a [contractsgenerator](https://github.com/leancodepl/contractsgenerator)
based api.

## Usage

### register

```ts
import { VerifyOptions } from "jsonwebtoken";

static register({ isGlobal = false, jwtStrategyConfig }: ApiProxySyncConfiguration): DynamicModule

export type ApiProxySyncConfiguration = {
    isGlobal?: boolean;
    jwtStrategyConfig: JwtStrategyConfig;
};

export type JwtStrategyConfig = {
    jwksUri: string;
    jsonWebTokenOptions?: VerifyOptions;
};
```

##### isGlobal

You can specify if you want to register a module globally.

##### jwksUri

Uri of your auth jwks.

##### jsonWebTokenOptions

`VerifyOptions` is a type imported from `jsonwebtoken` package.

### register example

```ts
const apiProxySyncConfig: ApiProxySyncConfiguration = {
    isGlobal: false,
    jwtStrategyConfig: {
        jwksUri: "https://localhost:3333/auth/.well-known/openid-configuration/jwks",
        jsonWebTokenOptions: {
            audience: "internal_api",
        },
    },
};

@Module({
    imports: [ApiProxyModule.register(apiProxySyncConfig), PassportModule.register({ defaultStrategy: "jwt" })],
    controllers: [],
    providers: [],
})
export class AppModule {}
```

### registerAsync

```ts
static registerAsync(options: ApiProxyAsyncConfiguration): DynamicModule

export type ApiProxyConfiguration = {
    jwtStrategyConfig: JwtStrategyConfig;
};

export interface ApiProxyAsyncConfiguration extends Pick<ModuleMetadata, "imports"> {
    useExisting?: Type<ApiProxyConfigurationFactory>;
    useClass?: Type<ApiProxyConfigurationFactory>;
    useFactory?: (...args: any[]) => Promise<ApiProxyConfiguration> | ApiProxyConfiguration;
    inject?: any[];
    extraProviders?: Provider[];
    isGlobal?: boolean;
}

export interface ApiProxyConfigurationFactory {
    createApiProxyConfiguration(): Promise<ApiProxyConfiguration> | ApiProxyConfiguration;
}
```

Every property will work the same as in the
[nestjs documentation](https://docs.nestjs.com/fundamentals/custom-providers#class-providers-useclass). If none of
useExisting, useClass and useFactory is specified, method will throw a `NotFoundException`.

### registerAsync example

```ts
const apiProxyConfig: ApiProxyConfiguration = {
    jwtStrategyConfig: {
        jwksUri: "https://localhost:3333/auth/.well-known/openid-configuration/jwks",
        jsonWebTokenOptions: {
            audience: "internal_api",
        },
    },
};

const apiProxyAsyncConfig: ApiProxyAsyncConfiguration = {
    isGlobal: false,
    useFactory: () => apiProxyConfig,
};

@Module({
    imports: [ApiProxyModule.registerAsync(apiProxyAsyncConfig), PassportModule.register({ defaultStrategy: "jwt" })],
    controllers: [],
    providers: [],
})
export class AppModule {}
```

### Providing a CqrsClient example

```ts
import Client from "./Client";

@Injectable()
export class CqrsClient1 {
    client;
    constructor(cqrsClientFactory: CqrsClientFactory) {
        this.client = Client(cqrsClientFactory.create(CqrsClient1.getApiEndpoint));
    }

    static getApiEndpoint(type: string) {
        return `http://localhost:3333/api/${type}`;
    }
}
```

Into your `Client` function, generated with
[contractsgenerator-typescript](https://www.npmjs.com/package/@leancodepl/contractsgenerator-typescript), you have to
pass the instance of `CqrsClient`, which can be created using `cqrsClientFactory.create` method. As args of this method
you have to pass a function with args `(type: string)`, which will be use for creating endpoint's url.

```ts
@Injectable()
export class Query1ComponentService {
    constructor(private client: CqrsClient1) {}

    async getComponent() {
        const test = await this.client.client.TestQueries.TestQuery1({});
        return <SampleComponent testString={test.test} />;
    }
}
```

Then you will be able to use your client's queries and commands.

Remember to add those classes as providers of your module.

```ts
@Module({
    imports: [ApiProxyModule.register(apiAndAuthConfig), PassportModule.register({ defaultStrategy: "jwt" })],
    providers: [CqrsClient1, Query1ComponentService],
})
export class AppModule {}
```
