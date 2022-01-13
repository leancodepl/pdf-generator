import { Module } from "@nestjs/common";
import { PdfRendererModule } from "@pdf-generator/pdf-renderer";
import { AppController } from "./app.controller";
import { SampleComponentService } from "./components-services/sampleComponent.service";
import { fontsConfiguration } from "./fonts";

@Module({
    imports: [PdfRendererModule.register({ fontsConfiguration })],
    controllers: [AppController],
    providers: [SampleComponentService],
})
export class AppModule {}
