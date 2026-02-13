import { Injectable, Logger } from "@nestjs/common"
import * as fontkit from "@pdf-lib/fontkit"
import { pdflibAddPlaceholder } from "@signpdf/placeholder-pdf-lib"
import { P12Signer } from "@signpdf/signer-p12"
import { SignPdf } from "@signpdf/signpdf"
import { SUBFILTER_ETSI_CADES_DETACHED } from "@signpdf/utils"
import { readFileSync } from "fs"
import { join } from "path"
import {
  beginText,
  endText,
  fill,
  moveText,
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFFont,
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
  stroke,
} from "pdf-lib"

/**
 * Bundled Roboto font files (Apache 2.0, google/roboto-2) for full Unicode
 * support including Polish diacritics (ą, ę, ś, ź, ż, ć, ń, ó, ł).
 *
 * After build the font files live at `<outputPath>/assets/fonts/`.
 * In source (`src/lib/`) they sit at `../assets/fonts/`.
 * Both paths resolve correctly because `@nx/js:tsc` strips the `src/` prefix.
 */
const fontsDir = join(__dirname, "..", "assets", "fonts")
const robotoRegularBytes = readFileSync(join(fontsDir, "Roboto-Regular.ttf"))
const robotoBoldBytes = readFileSync(join(fontsDir, "Roboto-Bold.ttf"))

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
   * When not provided, the signature is placed at the top of the last page, stretched across the full width.
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
  /**
   * Label text shown above the signer name in the visible signature widget.
   * @default "Digitally signed by"
   */
  signatureLabel?: string
}

const signpdf = new SignPdf()

@Injectable()
export class PdfSigner {
  private readonly logger = new Logger(PdfSigner.name)

  /**
   * Adds a signature placeholder to a new blank page appended at the end of
   * the PDF using pdf-lib. The extra page ensures the signature never covers
   * existing document content.
   *
   * By default, renders a visible signature widget at the top of the new page,
   * stretched across the full width, showing the signer's name and date.
   * Pass `widgetRect: [0, 0, 0, 0]` to create an invisible signature.
   *
   * @param pdfBuffer - The PDF as a Buffer
   * @param options - Options for the placeholder (reason, contactInfo, name, location, signatureLength, widgetRect)
   * @returns The PDF with the signature placeholder as a Buffer
   */
  async addPlaceholder(
    pdfBuffer: Buffer,
    options?: Pick<
      SignPdfOptions,
      "contactInfo" | "location" | "name" | "pades" | "reason" | "signatureLabel" | "signatureMaxLength" | "widgetRect"
    >,
  ): Promise<Buffer> {
    const signatureMaxLength = options?.signatureMaxLength ?? defaultSignatureMaxLength

    this.logger.debug("Loading PDF with pdf-lib")

    const pdfDoc = await PDFDocument.load(pdfBuffer)

    // Use the last existing page's dimensions for the new signature page
    const existingPages = pdfDoc.getPages()
    const lastExistingPage = existingPages[existingPages.length - 1]
    const { width: pageWidth, height: pageHeight } = lastExistingPage.getSize()

    // Append a blank page so the signature never overlaps existing content
    const signaturePage = pdfDoc.addPage([pageWidth, pageHeight])

    this.logger.debug("Added blank signature page at the end of the document")

    // Calculate widget rectangle — default to top of the new signature page, stretched across the full width
    const widgetRect: [number, number, number, number] = options?.widgetRect ?? [
      defaultSignatureMargin,
      pageHeight - defaultSignatureHeight - defaultSignatureMargin,
      pageWidth - defaultSignatureMargin,
      pageHeight - defaultSignatureMargin,
    ]

    this.logger.debug(`Adding signature placeholder to the signature page (page ${existingPages.length + 1})`)

    pdflibAddPlaceholder({
      pdfPage: signaturePage,
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
      await this.addSignatureAppearance(pdfDoc, signaturePage, {
        name: options?.name || "John Doe",
        reason: options?.reason,
        width: sigWidth,
        height: sigHeight,
        signatureLabel: options?.signatureLabel,
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
    opts: {
      name: string
      reason?: string
      width: number
      height: number
      signatureLabel?: string
    },
  ): Promise<void> {
    const { name, reason, width, height, signatureLabel } = opts

    // Register fontkit so pdf-lib can embed TTF fonts with full Unicode
    // support (including Polish diacritics like ą, ę, ś, ź, ż, ć, ń, ó, ł).
    pdfDoc.registerFontkit(fontkit)
    const font: PDFFont = await pdfDoc.embedFont(robotoRegularBytes, { subset: true })
    const fontBold: PDFFont = await pdfDoc.embedFont(robotoBoldBytes, { subset: true })

    const label = signatureLabel ?? "Digitally signed by"
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

      // Signature label
      beginText(),
      setFillingRgbColor(0.3, 0.3, 0.3),
      setFontAndSize(font.name, 7),
      moveText(5, height - 12),
      showText(font.encodeText(label)),
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
    const fontResources: Record<string, PDFRef> = { [font.name]: font.ref }

    if (fontBold !== font) {
      fontResources[fontBold.name] = fontBold.ref
    }

    const apStream = pdfDoc.context.formXObject(operators, {
      BBox: pdfDoc.context.obj([0, 0, width, height]),
      Matrix: pdfDoc.context.obj([1, 0, 0, 1, 0, 0]),
      Resources: {
        Font: fontResources,
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
