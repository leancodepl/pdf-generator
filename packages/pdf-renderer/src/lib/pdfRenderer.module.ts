import { DynamicModule, Module } from "@nestjs/common";
import { BrowserPool } from "./browserPool.service";
import { FontLibrary, FontsConfiguration, FontsConfigurationToken } from "./fontLibrary.service";
import { PdfGenerator } from "./pdfGenerator.service";
import { PdfRenderer } from "./pdfRenderer.service";
import { ReactRenderer } from "./reactRenderer.service";

@Module({
    providers: [BrowserPool, PdfGenerator, ReactRenderer, PdfRenderer, FontLibrary],
    exports: [PdfRenderer],
})
export class PdfRendererModule {
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
