import { UseJwtGuard } from "@leancodepl/api-proxy";
import { PdfRenderer } from "@leancodepl/pdf-renderer";
import { Controller, Get, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { Query1ComponentService } from "./components-services/query1Component.service";

@UseJwtGuard()
@Controller()
export class QueryController {
    constructor(
        private readonly pdfRenderer: PdfRenderer,
        private readonly query1ComponentService: Query1ComponentService,
    ) {}

    @Post("query1")
    async query1() {
        return {
            test: "test string",
        };
    }

    @Get("query1pdf")
    async query1pdf(@Res() res: Response) {
        const component = await this.query1ComponentService.getComponent();
        const stream = await this.pdfRenderer.generatePdf(component, []).asStream();

        const filename = "query1.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }
}
