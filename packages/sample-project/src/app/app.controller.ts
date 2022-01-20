import { PdfRenderer } from "@leancodepl/pdf-renderer";
import { Controller, Get, Res } from "@nestjs/common";
import type { Response } from "express";
import { BaseInvoiceService } from "./components-services/baseInvoice.service";
import { InvoiceTemplateService } from "./components-services/invoiceTemplate.service";
import { SampleComponentService } from "./components-services/sampleComponent.service";

@Controller("test")
export class AppController {
    constructor(
        private readonly pdfRenderer: PdfRenderer,
        private readonly sampleComponentService: SampleComponentService,
        private readonly baseInvoiceService: BaseInvoiceService,
        private readonly invoiceTemplateService: InvoiceTemplateService,
    ) {}

    @Get("pdf")
    async samplePdf(@Res() res: Response) {
        const stream = await this.pdfRenderer.generatePdf(this.sampleComponentService.getComponent(), []).asStream();

        const filename = "test.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }

    @Get("base-invoice")
    async baseInvoice(@Res() res: Response) {
        const stream = await this.pdfRenderer.generatePdf(this.baseInvoiceService.getComponent(), []).asStream();

        const filename = "base-invoice.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }

    @Get("invoice-template")
    async invoiceTemplate(@Res() res: Response) {
        const stream = await this.pdfRenderer.generatePdf(this.invoiceTemplateService.getComponent(), []).asStream();

        const filename = "invoice-template.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }
}
