import { PdfRendererModule } from "@leancodepl/pdf-renderer";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { BaseInvoiceService } from "./components-services/baseInvoice.service";
import { InvoiceTemplateService } from "./components-services/invoiceTemplate.service";
import { SampleComponentService } from "./components-services/sampleComponent.service";
import { fontsConfiguration } from "./fonts";

@Module({
    imports: [PdfRendererModule.register({ fontsConfiguration })],
    controllers: [AppController],
    providers: [SampleComponentService, BaseInvoiceService, InvoiceTemplateService],
})
export class AppModule {}
