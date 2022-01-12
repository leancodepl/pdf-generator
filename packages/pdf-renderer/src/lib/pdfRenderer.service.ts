import { ReactElement } from "react";
import { Injectable } from "@nestjs/common";
import { Readable } from "stream";
import PdfGenerator from "./pdfGenerator.service";
import ReactRenderer from "./reactRenderer.service";

@Injectable()
export default class PdfRenderer {
    constructor(private pdfGenerator: PdfGenerator, private reactRenderer: ReactRenderer) {}

    async generatePdf(element: ReactElement, fonts: (symbol | string)[]) {
        const html = this.reactRenderer.generate(element, fonts);

        const pdfBuffer = await this.pdfGenerator.generate(html);

        return {
            stream: new Readable({
                read() {
                    this.push(pdfBuffer);
                    this.push(null);
                },
            }),
            html,
        };
    }
}
