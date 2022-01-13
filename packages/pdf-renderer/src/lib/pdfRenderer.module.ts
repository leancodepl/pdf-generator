import { DynamicModule, Module } from "@nestjs/common";
import { PdfRenderer } from "..";
import { BrowserPool } from "./browserPool.service";
import { FontLibrary, FontsConfiguration, FontsConfigurationToken } from "./fontLibrary.service";
import { PdfGenerator } from "./pdfGenerator.service";
import { ReactRenderer } from "./reactRenderer.service";

@Module({})
export class PdfRendererModule {
    static register({ fontsConfiguration }: { fontsConfiguration: FontsConfiguration }): DynamicModule {
        return {
            exports: [PdfRenderer],
            module: PdfRendererModule,
            providers: [
                FontLibrary,
                BrowserPool,
                PdfGenerator,
                ReactRenderer,
                PdfRenderer,
                {
                    provide: FontsConfigurationToken,
                    useValue: fontsConfiguration,
                },
            ],
        };
    }
}
