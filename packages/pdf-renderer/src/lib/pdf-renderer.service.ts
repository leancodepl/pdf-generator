import { Injectable } from "@nestjs/common";
import { ReactElement } from "react";
import { Readable } from "stream";
import { PdfGenerator } from "./pdfGenerator.service";
import { ReactRenderer } from "./reactRenderer.service";

@Injectable()
export class PdfRenderer {
    constructor(private pdfGenerator: PdfGenerator, private reactRenderer: ReactRenderer) {}

    async generatePdf(element: ReactElement) {
        const html = this.reactRenderer.generate(element);

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
