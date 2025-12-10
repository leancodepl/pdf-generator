import { Injectable } from "@nestjs/common"
import { Page, PaperFormat, PDFOptions, ScreenshotOptions } from "puppeteer"
import { TaskFunction } from "puppeteer-cluster/dist/Cluster"
import { BrowserPool } from "./browserPool.service"

export type GeneratePdfPageParams = {
  html: string
  headerHtml?: string
  footerHtml?: string
  format: PaperFormat
  displayHeaderFooter: boolean
}

export type GeneratePageScreenshotParams = ScreenshotOptions & {
  html: string
}

@Injectable()
export class PdfGenerator {
  constructor(private browserPool: BrowserPool) {}

  private static async preparePage(
    page: Page,
    { html, headerHtml, footerHtml, format, displayHeaderFooter }: GeneratePdfPageParams,
  ): Promise<PDFOptions> {
    await page.setContent(html, {
      timeout: 60000,
      waitUntil: ["load", "domcontentloaded"],
    })

    return {
      timeout: 60000,
      format,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      headerTemplate: headerHtml,
      footerTemplate: footerHtml,
      displayHeaderFooter,
    }
  }

  private static async preparePageForScreenshot(page: Page, { html }: GeneratePageScreenshotParams): Promise<void> {
    await page.setContent(html, {
      timeout: 60000,
      waitUntil: ["load", "domcontentloaded"],
    })
  }

  private static generatePdfBufferTask: TaskFunction<GeneratePdfPageParams, Uint8Array> = async ({ page, data }) => {
    const pdfOptions = await PdfGenerator.preparePage(page, data)

    return await page.pdf(pdfOptions)
  }

  private static generatePdfStreamTask: TaskFunction<GeneratePdfPageParams, ReadableStream<Uint8Array>> = async ({
    page,
    data,
  }) => {
    const pdfOptions = await PdfGenerator.preparePage(page, data)

    return await page.createPDFStream(pdfOptions)
  }

  private static generateScreenshotTask: TaskFunction<GeneratePageScreenshotParams, Buffer> = async ({
    page,
    data,
  }) => {
    await PdfGenerator.preparePageForScreenshot(page, data)

    return (await page.screenshot(data)) as Buffer
  }

  async generateBuffer(params: GeneratePdfPageParams) {
    return this.browserPool.run(PdfGenerator.generatePdfBufferTask, params)
  }

  async generateStream(params: GeneratePdfPageParams) {
    return this.browserPool.run(PdfGenerator.generatePdfStreamTask, params)
  }

  async generateScreenshot(params: GeneratePageScreenshotParams) {
    return this.browserPool.run(PdfGenerator.generateScreenshotTask, params)
  }
}
