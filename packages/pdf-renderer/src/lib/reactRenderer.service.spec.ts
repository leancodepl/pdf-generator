import { Test } from "@nestjs/testing";
import { PdfRendererModule } from "./pdfRenderer.module";
import { ReactRenderer } from "./reactRenderer.service";

describe("ReactRendererService", () => {
    let service: ReactRenderer;

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [PdfRendererModule.register({ fontsConfiguration: {} })],
            providers: [],
        }).compile();

        service = app.get(ReactRenderer);
    });

    describe("test", () => {
        it("test", () => {
            expect(true);
        });
    });
});
