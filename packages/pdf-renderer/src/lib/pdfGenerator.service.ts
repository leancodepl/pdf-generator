import { Injectable } from "@nestjs/common";
import { TaskFunction } from "puppeteer-cluster/dist/Cluster";
import { BrowserPool } from "./browserPool.service";

@Injectable()
export class PdfGenerator {
    constructor(private browserPool: BrowserPool) {}

    private static generatePdfTask: TaskFunction<{ html: string }, Buffer> = async ({ page, data: { html } }) => {
        await page.setContent(html);

        return await page.pdf({
            format: "a4",
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        });
    };

    async generate(html: string) {
        return this.browserPool.run(PdfGenerator.generatePdfTask, { html });
    }
}
