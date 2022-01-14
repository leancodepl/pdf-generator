import React = require("react");
import { Test } from "@nestjs/testing";
import cheerio = require("cheerio");
import styled from "styled-components";
import { FontLibrary, FontsConfigurationToken } from "./fontLibrary.service";
import { ReactRenderer } from "./reactRenderer.service";

describe("ReactRendererService", () => {
    let service: ReactRenderer;

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                ReactRenderer,
                FontLibrary,
                {
                    provide: FontsConfigurationToken,
                    useValue: {},
                },
            ],
        }).compile();

        service = app.get(ReactRenderer);
    });

    describe("generate html", () => {
        it("should generate html with empty div", () => {
            const html = service.generate(React.createElement("div"), []);

            const $ = cheerio.load(html);

            expect($("body").length).toBeGreaterThan(0);
            expect($("body").find("div").length).toBeGreaterThan(0);
        });

        it("should generate html with styled component", () => {
            const html = service.generate(React.createElement(StyledDiv), []);

            const $ = cheerio.load(html);

            expect($(`[data-styled="true"]`).length).toBeGreaterThan(0);
            expect($(`[data-styled="true"]`).html()?.includes("height:10px;")).toBeTruthy();
        });
    });
});

const StyledDiv = styled.div`
    height: 10px;
`;
