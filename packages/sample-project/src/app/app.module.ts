import { PdfRendererModule } from "@leancodepl/pdf-renderer";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { SampleComponentService } from "./components-services/sampleComponent.service";
import { SampleInvoiceService } from "./components-services/sampleInvoice.service";
import { fontsConfiguration } from "./fonts";

@Module({
    imports: [PdfRendererModule.register({ fontsConfiguration })],
    controllers: [AppController],
    providers: [SampleComponentService, SampleInvoiceService],
})
export class AppModule {}
