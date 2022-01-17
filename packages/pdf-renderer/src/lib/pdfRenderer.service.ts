import { ReactElement } from "react";
import { Injectable } from "@nestjs/common";
import { Readable } from "stream";
import { PdfGenerator } from "./pdfGenerator.service";
import { ReactRenderer } from "./reactRenderer.service";

@Injectable()
export class PdfRenderer {
    constructor(private pdfGenerator: PdfGenerator, private reactRenderer: ReactRenderer) {}

    generatePdf(element: ReactElement, fonts: (symbol | string)[] = []) {
        const html = this.reactRenderer.generate(element, fonts);

        const mkBuffer = async () => await this.pdfGenerator.generate(html);

        return {
            asHtml: () => html,
            asBuffer: async () => await mkBuffer(),
            asStream: async () => {
                const buffer = await mkBuffer();

                return new Readable({
                    read() {
                        this.push(buffer);
                        this.push(null);
                    },
                });
            },
        };
    }
}
