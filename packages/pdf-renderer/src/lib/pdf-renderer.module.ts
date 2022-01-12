import { Module } from "@nestjs/common";
import { BrowserPool } from "./browserPool.service";
import { PdfRenderer } from "./pdf-renderer.service";
import { PdfGenerator } from "./pdfGenerator.service";
import { ReactRenderer } from "./reactRenderer.service";

@Module({
    providers: [BrowserPool, PdfGenerator, ReactRenderer, PdfRenderer],
    exports: [PdfRenderer],
})
export default class PdfRendererModule {}
