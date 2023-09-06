import { ReactElement } from "react";
import { Injectable, StreamableFile } from "@nestjs/common";
import { PaperFormat } from "puppeteer";
import { GeneratePdfPageParams, PdfGenerator } from "./pdfGenerator.service";
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

        const htmlWithHeaderAndFooter = this.reactRenderer.generateWithHeaderAndFooter(
            element,
            headerElement,
            footerElement,
            fonts,
        );

        const params: GeneratePdfPageParams = {
            html,
            headerHtml,
            footerHtml,
            format,
            displayHeaderFooter,
        };

        return {
            asHtml: () => htmlWithHeaderAndFooter,
            asBuffer: () => this.pdfGenerator.generateBuffer(params),
            // asStream: () => this.pdfGenerator.generateStream(params), // TODO: there seems to be an error when returning stream response from nest api
            asStream: async () => new StreamableFile(await this.pdfGenerator.generateBuffer(params)).getStream(),
        };
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
        element: ReactElement;
        fonts?: (symbol | string)[];
        captureBeyondViewport?: boolean;
        type?: "jpeg" | "png" | "webp";
        fullPage?: boolean;
        quality?: number;
        clip?: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        fromSurface?: boolean;
    }) {
        const html = this.reactRenderer.generate(element, fonts);

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
        };
    }
}
