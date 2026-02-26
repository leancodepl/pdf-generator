import { ComponentType, createElement, ReactElement } from "react"
import { Injectable, StreamableFile } from "@nestjs/common"
import { PaperFormat } from "puppeteer"
import { GeneratePdfPageParams, PdfGenerator } from "./pdfGenerator.service"
import { PdfSigner, SignatureAppearanceProps, SignPdfOptions } from "./pdfSigner.service"
import { ReactRenderer } from "./reactRenderer.service"

@Injectable()
export class PdfRenderer {
  constructor(
    private pdfGenerator: PdfGenerator,
    private reactRenderer: ReactRenderer,
    private pdfSigner: PdfSigner,
  ) {}

  generatePdf({
    element,
    fonts = [],
    headerElement,
    footerElement,
    format = "a4",
    displayHeaderFooter = false,
    signature,
    signatureFonts,
  }: {
    element: ReactElement
    fonts?: (string | symbol)[]
    headerElement?: ReactElement
    footerElement?: ReactElement
    format?: PaperFormat
    displayHeaderFooter?: boolean
    signature?: ComponentType<SignatureAppearanceProps>
    signatureFonts?: (string | symbol)[]
  }) {
    const html = this.reactRenderer.generate(element, fonts)
    const headerHtml = headerElement && this.reactRenderer.generate(headerElement, fonts)
    const footerHtml = footerElement && this.reactRenderer.generate(footerElement, fonts)

    const htmlWithHeaderAndFooter = this.reactRenderer.generateWithHeaderAndFooter(
      element,
      headerElement,
      footerElement,
      fonts,
    )

    const params: GeneratePdfPageParams = {
      html,
      headerHtml,
      footerHtml,
      format,
      displayHeaderFooter,
    }

    return {
      asHtml: () => htmlWithHeaderAndFooter,
      asBuffer: () => this.pdfGenerator.generateBuffer(params),
      // asStream: () => this.pdfGenerator.generateStream(params), // TODO: there seems to be an error when returning stream response from nest api
      asStream: async () => new StreamableFile(await this.pdfGenerator.generateBuffer(params)).getStream(),
      asSignedBuffer: async (signOptions: SignPdfOptions) => {
        const pdfBuffer = await this.pdfGenerator.generateBuffer(params)
        const enrichedOptions = await this.enrichSignOptionsWithSignatureImage(
          signOptions,
          signature,
          signatureFonts ?? fonts,
        )
        return this.pdfSigner.sign(Buffer.from(pdfBuffer), enrichedOptions)
      },
      asSignedStream: async (signOptions: SignPdfOptions) => {
        const pdfBuffer = await this.pdfGenerator.generateBuffer(params)
        const enrichedOptions = await this.enrichSignOptionsWithSignatureImage(
          signOptions,
          signature,
          signatureFonts ?? fonts,
        )
        return new StreamableFile(await this.pdfSigner.sign(Buffer.from(pdfBuffer), enrichedOptions)).getStream()
      },
    }
  }

  private async enrichSignOptionsWithSignatureImage(
    signOptions: SignPdfOptions,
    signature?: ComponentType<SignatureAppearanceProps>,
    fonts: (string | symbol)[] = [],
  ): Promise<SignPdfOptions> {
    if (!signature) {
      return signOptions
    }

    const props: SignatureAppearanceProps = {
      name: signOptions.name ?? "",
      date: new Date().toISOString(),
      reason: signOptions.reason,
      location: signOptions.location,
      contactInfo: signOptions.contactInfo,
    }

    const signatureImage = await this.renderSignatureImage(signature, props, fonts)

    return { ...signOptions, signatureImage }
  }

  private async renderSignatureImage(
    component: ComponentType<SignatureAppearanceProps>,
    props: SignatureAppearanceProps,
    fonts: (string | symbol)[],
  ): Promise<Buffer> {
    const element = createElement(component, props)
    const html = this.reactRenderer.generate(element, fonts)

    return this.pdfGenerator.generateElementScreenshot(html)
  }

  generateImage({
    element,
    fonts = [],
    captureBeyondViewport,
    type,
    fullPage,
    quality,
    clip,
    fromSurface,
  }: {
    element: ReactElement
    fonts?: (string | symbol)[]
    captureBeyondViewport?: boolean
    type?: "jpeg" | "png" | "webp"
    fullPage?: boolean
    quality?: number
    clip?: {
      x: number
      y: number
      width: number
      height: number
    }
    fromSurface?: boolean
  }) {
    const html = this.reactRenderer.generate(element, fonts)

    return {
      asBuffer: () =>
        this.pdfGenerator.generateScreenshot({
          html,
          captureBeyondViewport,
          type,
          fullPage,
          quality,
          clip,
          fromSurface,
        }),
      asStream: async () => new StreamableFile(await this.pdfGenerator.generateScreenshot({ html })).getStream(),
    }
  }
}
