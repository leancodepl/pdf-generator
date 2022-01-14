import { Test } from "@nestjs/testing";
import { FontLibrary, FontsConfigurationToken } from "./fontLibrary.service";

describe("FontLibraryService", () => {
    describe("getFont", () => {
        it("should throw error if there is no font", async () => {
            const app = await Test.createTestingModule({
                providers: [
                    FontLibrary,
                    {
                        provide: FontsConfigurationToken,
                        useValue: {},
                    },
                ],
            }).compile();

            const service = app.get(FontLibrary);

            expect(() => service.getFont("test")).toThrowError();
        });

        it("should return a font", async () => {
            const app = await Test.createTestingModule({
                providers: [
                    FontLibrary,
                    {
                        provide: FontsConfigurationToken,
                        useValue: {
                            test: {
                                fontFamily: "test",
                                fontFile: Buffer.from("test"),
                            },
                        },
                    },
                ],
            }).compile();

            const service = app.get(FontLibrary);

            expect(service.getFont("test")).toBeTruthy();
        });
    });
});
