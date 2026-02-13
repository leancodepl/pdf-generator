import { Injectable, Logger } from "@nestjs/common"
import { pdflibAddPlaceholder } from "@signpdf/placeholder-pdf-lib"
import { P12Signer } from "@signpdf/signer-p12"
import { SignPdf } from "@signpdf/signpdf"
import { SUBFILTER_ETSI_CADES_DETACHED } from "@signpdf/utils"
import {
  beginText,
  endText,
  fill,
  moveText,
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFOperator,
  PDFPage,
  PDFRef,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
  setFillingRgbColor,
  setFontAndSize,
  setLineWidth,
  setStrokingRgbColor,
  showText,
  StandardFonts,
  stroke,
} from "pdf-lib"

const defaultSignatureMaxLength = 8192

/** Default visible signature dimensions in PDF points */
const defaultSignatureWidth = 200
const defaultSignatureHeight = 50
const defaultSignatureMargin = 50

export type SignPdfOptions = {
  /** P12/PFX certificate bundle as a Buffer */
  p12Buffer: Buffer
  /** Passphrase for the P12 certificate */
  passphrase?: string
  /** Reason for signing */
  reason?: string
  /** Contact information of the signer */
  contactInfo?: string
  /** Location where the document was signed */
  location?: string
  /** Name of the signer */
  name?: string
  /**
   * Maximum length (in bytes) reserved for the PKCS#7 signature.
   * Increase this if signing fails due to a large certificate chain.
   * @default 8192
   */
  signatureMaxLength?: number
  /**
   * Custom [x1, y1, x2, y2] rectangle for the visible signature widget.
   * When not provided, the signature is placed at the bottom-right of the last page.
   * Set to [0, 0, 0, 0] to make the signature invisible.
   */
  widgetRect?: [number, number, number, number]
  /**
   * When true, uses the `ETSI.CAdES.detached` SubFilter for PAdES
   * (PDF Advanced Electronic Signatures) instead of the default
   * `adbe.pkcs7.detached`.
   *
   * @default false
   */
  pades?: boolean
}

const signpdf = new SignPdf()

@Injectable()
export class PdfSigner {
  private readonly logger = new Logger(PdfSigner.name)

  /**
   * Adds a signature placeholder to the last page of the PDF using pdf-lib.
   *
   * By default, renders a visible signature widget at the bottom-right of the
   * last page showing the signer's name and date. Pass `widgetRect: [0, 0, 0, 0]`
   * to create an invisible signature.
   *
   * @param pdfBuffer - The PDF as a Buffer
   * @param options - Options for the placeholder (reason, contactInfo, name, location, signatureLength, widgetRect)
   * @returns The PDF with the signature placeholder as a Buffer
   */
  async addPlaceholder(
    pdfBuffer: Buffer,
    options?: Pick<
      SignPdfOptions,
      "contactInfo" | "location" | "name" | "pades" | "reason" | "signatureMaxLength" | "widgetRect"
    >,
  ): Promise<Buffer> {
    const signatureMaxLength = options?.signatureMaxLength ?? defaultSignatureMaxLength

    this.logger.debug("Loading PDF with pdf-lib")

    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const pages = pdfDoc.getPages()
    const lastPage = pages[pages.length - 1]

    // Calculate widget rectangle — default to bottom-right of the last page
    const { width: pageWidth } = lastPage.getSize()
    const widgetRect: [number, number, number, number] = options?.widgetRect ?? [
      pageWidth - defaultSignatureWidth - defaultSignatureMargin,
      defaultSignatureMargin,
      pageWidth - defaultSignatureMargin,
      defaultSignatureMargin + defaultSignatureHeight,
    ]

    this.logger.debug(`Adding signature placeholder to the last page (page ${pages.length})`)

    pdflibAddPlaceholder({
      pdfPage: lastPage,
      reason: options?.reason ?? "",
      contactInfo: options?.contactInfo ?? "",
      name: options?.name ?? "",
      location: options?.location ?? "",
      signatureLength: signatureMaxLength,
      widgetRect,
      ...(options?.pades ? { subFilter: SUBFILTER_ETSI_CADES_DETACHED } : {}),
    })

    // Add visible signature appearance if the widget has a non-zero area
    const sigWidth = widgetRect[2] - widgetRect[0]
    const sigHeight = widgetRect[3] - widgetRect[1]

    if (sigWidth > 0 && sigHeight > 0) {
      await this.addSignatureAppearance(pdfDoc, lastPage, {
        name: options?.name || "John Doe",
        reason: options?.reason,
        width: sigWidth,
        height: sigHeight,
      })
    }

    const pdfWithPlaceholderBytes = await pdfDoc.save()

    return Buffer.from(pdfWithPlaceholderBytes)
  }

  /**
   * Digitally signs a PDF buffer using a P12/PFX certificate bundle.
   *
   * Uses pdf-lib with @signpdf/placeholder-pdf-lib to add the signature placeholder
   * to the last page of the document, then signs with @signpdf/signer-p12.
   *
   * @param pdfBuffer - The unsigned PDF as a Buffer
   * @param options - Signing options including P12 certificate bundle
   * @returns The signed PDF as a Buffer
   */
  async sign(pdfBuffer: Buffer, options: SignPdfOptions): Promise<Buffer> {
    this.logger.debug("Adding signature placeholder to PDF using pdf-lib")

    const pdfWithPlaceholder = await this.addPlaceholder(pdfBuffer, options)

    this.logger.debug("Signing PDF with P12 signer")

    const signer = new P12Signer(options.p12Buffer, {
      passphrase: options.passphrase ?? "",
    })

    const signedPdf = await signpdf.sign(pdfWithPlaceholder, signer)

    this.logger.debug("PDF signed successfully")

    return signedPdf
  }

  /**
   * Replaces the empty appearance stream of the signature widget annotation
   * with one that renders the signer's name and date.
   */
  private async addSignatureAppearance(
    pdfDoc: PDFDocument,
    page: PDFPage,
    opts: { name: string; reason?: string; width: number; height: number },
  ): Promise<void> {
    const { name, reason, width, height } = opts

    // Embed a standard font for the signature text
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const dateTime = new Date().toISOString()

    // Build the appearance stream operators
    const operators: PDFOperator[] = [
      pushGraphicsState(),

      // Light gray background
      setFillingRgbColor(0.95, 0.95, 0.95),
      rectangle(0, 0, width, height),
      fill(),

      // Gray border
      setStrokingRgbColor(0.6, 0.6, 0.6),
      setLineWidth(0.5),
      rectangle(0.25, 0.25, width - 0.5, height - 0.5),
      stroke(),

      // "Digitally signed by" label
      beginText(),
      setFillingRgbColor(0.3, 0.3, 0.3),
      setFontAndSize(font.name, 7),
      moveText(5, height - 12),
      showText(font.encodeText("Digitally signed by")),
      endText(),

      // Signer name
      beginText(),
      setFillingRgbColor(0, 0, 0),
      setFontAndSize(fontBold.name, 10),
      moveText(5, height - 25),
      showText(fontBold.encodeText(name)),
      endText(),

      // Date
      beginText(),
      setFillingRgbColor(0.3, 0.3, 0.3),
      setFontAndSize(font.name, 7),
      moveText(5, height - 37),
      showText(font.encodeText(dateTime)),
      endText(),
    ]

    // Add reason line if provided
    if (reason) {
      operators.push(
        beginText(),
        setFillingRgbColor(0.3, 0.3, 0.3),
        setFontAndSize(font.name, 7),
        moveText(5, height - 47),
        showText(font.encodeText(reason)),
        endText(),
      )
    }

    operators.push(popGraphicsState())

    // Create a form XObject for the signature appearance
    const apStream = pdfDoc.context.formXObject(operators, {
      BBox: pdfDoc.context.obj([0, 0, width, height]),
      Matrix: pdfDoc.context.obj([1, 0, 0, 1, 0, 0]),
      Resources: {
        Font: {
          [font.name]: font.ref,
          [fontBold.name]: fontBold.ref,
        },
      },
    })

    const apStreamRef = pdfDoc.context.register(apStream)

    // Find the signature widget annotation (last annotation added to the page)
    const annots = page.node.lookup(PDFName.of("Annots"), PDFArray)
    const widgetRef = annots.get(annots.size() - 1) as PDFRef
    const widgetDict = pdfDoc.context.lookup(widgetRef) as PDFDict

    // Replace the empty normal appearance with our visual one
    const apDict = widgetDict.lookup(PDFName.of("AP")) as PDFDict
    apDict.set(PDFName.of("N"), apStreamRef)

    this.logger.debug("Visible signature appearance added successfully")
  }
}
