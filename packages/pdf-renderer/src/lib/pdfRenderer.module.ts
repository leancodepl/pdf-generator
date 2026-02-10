import { DynamicModule, Module } from "@nestjs/common"
import { createJsonLogger } from "@leancodepl/logger"
import { PdfRenderer } from ".."
import { BrowserPool } from "./browserPool.service"
import { FontLibrary, FontsConfiguration, FontsConfigurationToken } from "./fontLibrary.service"
import { defaultLogger, pdfRendererLoggerSymbol } from "./logger"
import { PdfGenerator } from "./pdfGenerator.service"
import { ReactRenderer } from "./reactRenderer.service"

export type PdfRendererConfiguration = {
  isGlobal?: boolean
  fontsConfiguration: FontsConfiguration
  logger?: ReturnType<typeof createJsonLogger>
}

@Module({})
export class PdfRendererModule {
  static register({ isGlobal = true, fontsConfiguration, logger }: PdfRendererConfiguration): DynamicModule {
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
        { provide: pdfRendererLoggerSymbol, useValue: logger ?? defaultLogger },
      ],
    }
  }
}
