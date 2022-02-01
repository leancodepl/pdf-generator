import { ApiProxyModule } from "@leancodepl/api-proxy";
import { polishInvoiceFontsConfig } from "@leancodepl/invoice-template";
import { PdfRendererModule } from "@leancodepl/pdf-renderer";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import path = require("path/posix");
import { AppController } from "./app.controller";
import { BaseInvoiceService } from "./components-services/baseInvoice.service";
import { CqrsClient1 } from "./components-services/CqrsClient1";
import { InvoiceTemplateService } from "./components-services/invoiceTemplate.service";
import { PolishInvoiceTemplateService } from "./components-services/polishInvoiceTemplate.service";
import { Query1ComponentService } from "./components-services/query1Component.service";
import { SampleComponentService } from "./components-services/sampleComponent.service";
import { fontsPath } from "./fonts";
import { QueryController } from "./query.controller";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvVars: true,
        }),
        PdfRendererModule.register({
            fontsConfiguration: polishInvoiceFontsConfig.moduleConfig({
                regular: path.join(fontsPath, "open-sans-v17-latin-ext-regular.woff"),
                bold: path.join(fontsPath, "open-sans-v17-latin-ext-600.woff"),
            }),
        }),
        ApiProxyModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                jwtStrategyConfig: {
                    jwksUri: configService.get("JWKS_URI") ?? "",
                    jsonWebTokenOptions: {
                        audience: "internal_api",
                    },
                },
            }),
            inject: [ConfigService],
        }),
        PassportModule.register({ defaultStrategy: "jwt" }),
    ],
    controllers: [AppController, QueryController],
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
