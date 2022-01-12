import { ReactElement } from "react";
import { Inject, Injectable } from "@nestjs/common";
import { renderToStaticMarkup } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import { FontLibrary } from "./fontLibrary.service";

@Injectable()
export class ReactRenderer {
    constructor(@Inject() private fontLibrary: FontLibrary) {}

    generate(element: ReactElement, fonts: (symbol | string)[] = []) {
        const sheet = new ServerStyleSheet();
        const html = renderToStaticMarkup(sheet.collectStyles(element));

        const styleTags = sheet.getStyleTags();

        sheet.seal();

        return `
            <html>
                <head>
                    <style>
                        ${fonts.map(this.fontLibrary.getFont).join("\n")}
                    </style>
                    ${styleTags}
                </head>
                <body>
                    ${html}
                </body>
            </html>
        `;
    }
}
