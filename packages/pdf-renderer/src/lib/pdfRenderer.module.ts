import { DynamicModule, Module } from "@nestjs/common"
import { PdfRenderer } from ".."
import { BrowserPool } from "./browserPool.service"
import { FontLibrary, FontsConfiguration, FontsConfigurationToken } from "./fontLibrary.service"
import { PdfGenerator } from "./pdfGenerator.service"
import { PdfSigner } from "./pdfSigner.service"
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
      exports: [PdfRenderer, PdfSigner],
      module: PdfRendererModule,
      providers: [
        FontLibrary,
        BrowserPool,
        PdfGenerator,
        ReactRenderer,
        PdfRenderer,
        PdfSigner,
        {
          provide: FontsConfigurationToken,
          useValue: fontsConfiguration,
        },
      ],
    }
  }
}
