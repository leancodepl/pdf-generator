import { ApiProxyConfiguration, ApiProxyModule } from "@leancodepl/api-proxy";
import { PdfRendererModule } from "@leancodepl/pdf-renderer";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AppController } from "./app.controller";
import { BaseInvoiceService } from "./components-services/baseInvoice.service";
import { CqrsClient1 } from "./components-services/CqrsClient1";
import { InvoiceTemplateService } from "./components-services/invoiceTemplate.service";
import { Query1ComponentService } from "./components-services/query1Component.service";
import { SampleComponentService } from "./components-services/sampleComponent.service";
import { fontsConfiguration } from "./fonts";
import { QueryController } from "./query.controller";

const apiAndAuthConfig: ApiProxyConfiguration = {
    jwtStrategyConfig: {
        jwksUri: "https://api.prospector.test.lncd.pl/auth/.well-known/openid-configuration/jwks",
        jsonWebTokenOptions: {
            audience: "internal_api",
        },
    },
};

@Module({
    imports: [
        PdfRendererModule.register({ fontsConfiguration }),
        ApiProxyModule.registerAsync({
            isGlobal: true,
            useFactory: () => apiAndAuthConfig,
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
    ],
})
export class AppModule {}
