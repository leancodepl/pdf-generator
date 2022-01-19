import { PdfRenderer } from "@leancodepl/pdf-renderer";
import { Controller, Get, Res } from "@nestjs/common";
import type { Response } from "express";
import { SampleComponentService } from "./components-services/sampleComponent.service";
import { SampleInvoiceService } from "./components-services/sampleInvoice.service";

@Controller("test")
export class AppController {
    constructor(
        private readonly pdfRenderer: PdfRenderer,
        private readonly sampleComponentService: SampleComponentService,
        private readonly sampleInvoiceService: SampleInvoiceService,
    ) {}

    @Get("pdf")
    async samplePdf(@Res() res: Response) {
        const stream = await this.pdfRenderer.generatePdf(this.sampleComponentService.getComponent(), []).asStream();

        const filename = "test.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }

    @Get("invoice")
    async sampleInvoice(@Res() res: Response) {
        const stream = await this.pdfRenderer.generatePdf(this.sampleInvoiceService.getComponent(), []).asStream();

        const filename = "invoice.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }
}
