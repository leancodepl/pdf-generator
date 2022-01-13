import { Controller, Get, Res } from "@nestjs/common";
import { PdfRenderer } from "@pdf-generator/pdf-renderer";
import type { Response } from "express";
import { SampleComponentService } from "./components-services/sampleComponent.service";

@Controller("test")
export class AppController {
    constructor(
        private readonly pdfRenderer: PdfRenderer,
        private readonly sampleComponentService: SampleComponentService,
    ) {}

    @Get("pdf")
    async samplePdf(@Res() res: Response) {
        const { stream } = await this.pdfRenderer.generatePdf(this.sampleComponentService.getComponent(), []);

        const filename = "test.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }
}
