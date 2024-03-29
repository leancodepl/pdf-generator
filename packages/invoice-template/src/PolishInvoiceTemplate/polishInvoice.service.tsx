import { PdfRenderer } from "@leancodepl/pdf-renderer";
import { Injectable } from "@nestjs/common";
import { PolishInvoiceTemplate, PolishInvoiceTemplateProps } from ".";
import { pdfRendererConfig } from "./fontsConfig";

@Injectable()
export class PolishInvoiceService {
    constructor(private readonly pdfRenderer: PdfRenderer) {}

    renderInvoice(props: PolishInvoiceTemplateProps) {
        return this.pdfRenderer.generatePdf({
            element: <PolishInvoiceTemplate {...props} />,
            fonts: pdfRendererConfig,
        });
    }

    renderInvoiceImage(props: PolishInvoiceTemplateProps) {
        return this.pdfRenderer.generateImage({
            element: <PolishInvoiceTemplate {...props} />,
            fonts: pdfRendererConfig,
            fullPage: true,
        });
    }
}
