import { DynamicModule, Module } from "@nestjs/common";
import BrowserPool from "./browserPool.service";
import { FontsConfiguration, FontsConfigurationToken } from "./FontLibrary";
import PdfGenerator from "./pdfGenerator.service";
import PdfRenderer from "./pdfRenderer.service";
import ReactRenderer from "./reactRenderer.service";

@Module({
    providers: [BrowserPool, PdfGenerator, ReactRenderer, PdfRenderer],
    exports: [PdfRenderer],
})
export default class PdfRendererModule {
    static forRoot({ fontsConfiguration }: { fontsConfiguration: FontsConfiguration }): DynamicModule {
        return {
            module: PdfRendererModule,
            providers: [
                {
                    provide: FontsConfigurationToken,
                    useValue: fontsConfiguration,
                },
            ],
        };
    }
}
