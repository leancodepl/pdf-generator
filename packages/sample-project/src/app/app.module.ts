import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { PassportModule } from "@nestjs/passport"
import path = require("path/posix")
import { ApiProxyModule } from "@leancodepl/api-proxy"
import { PolishInvoiceModule } from "@leancodepl/invoice-template"
import { AppController } from "./app.controller"
import { BaseInvoiceService } from "./components-services/baseInvoice.service"
import { CqrsClient1 } from "./components-services/CqrsClient1"
import { InvoiceTemplateService } from "./components-services/invoiceTemplate.service"
import { PolishInvoiceTemplateService } from "./components-services/polishInvoiceTemplate.service"
import { Query1ComponentService } from "./components-services/query1Component.service"
import { SampleComponentService } from "./components-services/sampleComponent.service"
import { fontsPath } from "./fonts"
import { KratosController } from "./kratos.controller"
import { QueryController } from "./query.controller"

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvVars: true,
    }),
    PolishInvoiceModule.register({
      rendererConfig: {
        isGlobal: true,
        regularFont: path.join(fontsPath, "open-sans-v17-latin-ext-regular.woff"),
        boldFont: path.join(fontsPath, "open-sans-v17-latin-ext-600.woff"),
      },
    }),
    ApiProxyModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // JWT authentication (e.g., for OAuth2/OIDC providers)
        jwtStrategyConfig: {
          jwksUri: configService.get("JWKS_URI") ?? "",
          jsonWebTokenOptions: {
            audience: "internal_api",
          },
        },
        // Ory Kratos authentication (for Kratos-based identity management)
        kratosStrategyConfig: {
          kratosPublicUrl: configService.get("KRATOS_PUBLIC_URL") ?? "",
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  controllers: [AppController, QueryController, KratosController],
  providers: [
    SampleComponentService,
    BaseInvoiceService,
    InvoiceTemplateService,
    CqrsClient1,
    Query1ComponentService,
    PolishInvoiceTemplateService,
  ],
})
export class AppModule {}
