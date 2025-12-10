import { DynamicModule, Module } from "@nestjs/common"
import { PdfRenderer } from ".."
import { BrowserPool } from "./browserPool.service"
import { FontLibrary, FontsConfiguration, FontsConfigurationToken } from "./fontLibrary.service"
import { PdfGenerator } from "./pdfGenerator.service"
import { ReactRenderer } from "./reactRenderer.service"

export type PdfRendererConfiguration = {
  isGlobal?: boolean
  fontsConfiguration: FontsConfiguration
}

@Module({})
export class PdfRendererModule {
  static register({ isGlobal = true, fontsConfiguration }: PdfRendererConfiguration): DynamicModule {
    return {
      global: isGlobal,
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
    }
  }
}
