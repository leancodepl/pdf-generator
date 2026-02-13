import { DynamicModule, Module } from "@nestjs/common"
import { JsonLogger } from "@leancodepl/logger"
import { PdfRendererModule } from "@leancodepl/pdf-renderer"
import { moduleConfig, PolishInvoiceService } from ".."

type PolishInvoiceModuleConfig = {
  rendererConfig?: {
    isGlobal?: boolean
    regularFont: Buffer | string
    boldFont: Buffer | string
    logger?: JsonLogger
  }
}

@Module({})
export class PolishInvoiceModule {
  static register({ rendererConfig }: PolishInvoiceModuleConfig): DynamicModule {
    const rendererImport = rendererConfig
      ? [
          PdfRendererModule.register({
            isGlobal: rendererConfig.isGlobal,
            fontsConfiguration: moduleConfig({
              regular: rendererConfig.regularFont,
              bold: rendererConfig.boldFont,
            }),
            logger: rendererConfig.logger,
          }),
        ]
      : []

    return {
      exports: [PolishInvoiceService],
      imports: [...rendererImport],
      module: PolishInvoiceModule,
      providers: [PolishInvoiceService],
    }
  }
}
