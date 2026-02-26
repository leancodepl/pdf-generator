import { Controller, Get, Inject, Post, Res } from "@nestjs/common"
import { UseJwtGuard } from "@leancodepl/api-proxy"
import { PdfRenderer } from "@leancodepl/pdf-renderer"
import { Query1ComponentService } from "./components-services/query1Component.service"
import { type AppLogger, LOGGER } from "./logger"
import type { Response } from "express"

@UseJwtGuard()
@Controller()
export class QueryController {
  constructor(
    private readonly pdfRenderer: PdfRenderer,
    private readonly query1ComponentService: Query1ComponentService,
    @Inject(LOGGER) private readonly logger: AppLogger,
  ) {}

  @Post("query1")
  async query1() {
    this.logger.info("query1 called")
    return {
      test: "test string",
    }
  }

  @Get("query1pdf")
  async query1pdf(@Res() res: Response) {
    this.logger.info("Generating query1 PDF")
    const component = await this.query1ComponentService.getComponent()
    const stream = await this.pdfRenderer.generatePdf({ element: component }).asStream()

    const filename = "query1.pdf"

    res.header("Content-Type", "application/pdf")
    res.header("Content-Disposition", `attachment; filename="${filename}"`)

    stream.pipe(res)
  }
}
