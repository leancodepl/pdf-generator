import { ReactElement } from "react";
import { Injectable } from "@nestjs/common";
import { PaperFormat } from "puppeteer";
import { GeneratePageParams, PdfGenerator } from "./pdfGenerator.service";
import { ReactRenderer } from "./reactRenderer.service";

@Injectable()
export class PdfRenderer {
    constructor(private pdfGenerator: PdfGenerator, private reactRenderer: ReactRenderer) {}

    generatePdf({
        element,
        fonts = [],
        headerElement,
        footerElement,
        format = "a4",
        displayHeaderFooter = false,
    }: {
        element: ReactElement;
        fonts?: (symbol | string)[];
        headerElement?: ReactElement;
        footerElement?: ReactElement;
        format?: PaperFormat;
        displayHeaderFooter?: boolean;
    }) {
        const html = this.reactRenderer.generate(element, fonts);
        const headerHtml = headerElement && this.reactRenderer.generate(headerElement, fonts);
        const footerHtml = footerElement && this.reactRenderer.generate(footerElement, fonts);

        const params: GeneratePageParams = {
            html,
            headerHtml,
            footerHtml,
            format,
            displayHeaderFooter,
        };

        return {
            asHtml: () => html,
            asBuffer: () => this.pdfGenerator.generateBuffer(params),
            asStream: () => this.pdfGenerator.generateStream(params),
        };
    }
}
