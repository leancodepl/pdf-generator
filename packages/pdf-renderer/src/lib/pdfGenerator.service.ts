import { Injectable } from "@nestjs/common";
import { Page, PaperFormat, PDFOptions } from "puppeteer";
import { TaskFunction } from "puppeteer-cluster/dist/Cluster";
import { Readable } from "stream";
import { BrowserPool } from "./browserPool.service";

export type GeneratePageParams = {
    html: string;
    headerHtml?: string;
    footerHtml?: string;
    format: PaperFormat;
    displayHeaderFooter: boolean;
};

@Injectable()
export class PdfGenerator {
    constructor(private browserPool: BrowserPool) {}

    private static async preparePage(
        page: Page,
        { html, headerHtml, footerHtml, format, displayHeaderFooter }: GeneratePageParams,
    ): Promise<PDFOptions> {
        await page.setContent(html);

        return {
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
        };
    }

    private static generatePdfBufferTask: TaskFunction<GeneratePageParams, Buffer> = async ({ page, data }) => {
        const pdfOptions = await PdfGenerator.preparePage(page, data);

        return await page.pdf(pdfOptions);
    };

    private static generatePdfStreamTask: TaskFunction<GeneratePageParams, Readable> = async ({ page, data }) => {
        const pdfOptions = await PdfGenerator.preparePage(page, data);

        return await page.createPDFStream(pdfOptions);
    };

    async generateBuffer(params: GeneratePageParams) {
        return this.browserPool.run(PdfGenerator.generatePdfBufferTask, params);
    }

    async generateStream(params: GeneratePageParams) {
        return this.browserPool.run(PdfGenerator.generatePdfStreamTask, params);
    }
}
