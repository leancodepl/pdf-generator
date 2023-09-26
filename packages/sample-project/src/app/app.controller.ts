import { PdfRenderer } from "@leancodepl/pdf-renderer";
import { Controller, Get, Res } from "@nestjs/common";
import type { Response } from "express";
import { BaseInvoiceService } from "./components-services/baseInvoice.service";
import { InvoiceTemplateService } from "./components-services/invoiceTemplate.service";
import { PolishInvoiceTemplateService } from "./components-services/polishInvoiceTemplate.service";
import { SampleComponentService } from "./components-services/sampleComponent.service";

@Controller("test")
export class AppController {
    // eslint-disable-next-line max-params
    constructor(
        private readonly pdfRenderer: PdfRenderer,
        private readonly sampleComponentService: SampleComponentService,
        private readonly baseInvoiceService: BaseInvoiceService,
        private readonly invoiceTemplateService: InvoiceTemplateService,
        private readonly polishInvoiceTemplateService: PolishInvoiceTemplateService,
    ) {}

    @Get("pdf")
    async samplePdf(@Res() res: Response) {
        const stream = await this.pdfRenderer
            .generatePdf({ element: this.sampleComponentService.getComponent() })
            .asStream();

        const filename = "test.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }

    @Get("png")
    async samplePng(@Res() res: Response) {
        const buffer = await this.pdfRenderer
            .generateImage({ element: this.sampleComponentService.getComponent() })
            .asBuffer();

        const filename = "test.png";

        res.header("Content-Type", "image/png");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        res.send(buffer);
    }

    @Get("base-invoice")
    async baseInvoice(@Res() res: Response) {
        const stream = await this.pdfRenderer
            .generatePdf({ element: this.baseInvoiceService.getComponent() })
            .asStream();

        const filename = "base-invoice.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }

    @Get("invoice-template")
    async invoiceTemplate(@Res() res: Response) {
        const stream = await this.pdfRenderer
            .generatePdf({ element: this.invoiceTemplateService.getComponent() })
            .asStream();

        const filename = "invoice-template.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }

    @Get("polish-invoice")
    async polishInvoice(@Res() res: Response) {
        const stream = await this.polishInvoiceTemplateService.getRender().asStream();

        const filename = "polish-invoice.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }

    @Get("polish-invoice-png")
    async polishInvoicePng(@Res() res: Response) {
        const buffer = await this.polishInvoiceTemplateService.getRenderScreenshot().asBuffer();

        const filename = "polish-invoice.png";

        res.header("Content-Type", "image/png");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        res.send(buffer);
    }
}
