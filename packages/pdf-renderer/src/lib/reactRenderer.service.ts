import { ReactElement } from "react";
import { Injectable } from "@nestjs/common";
import { renderToStaticMarkup } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import openSans from "./fonts/OpenSans";

@Injectable()
export class ReactRenderer {
    generate(element: ReactElement) {
        const sheet = new ServerStyleSheet();
        const html = renderToStaticMarkup(sheet.collectStyles(element));

        const styleTags = sheet.getStyleTags();

        sheet.seal();

        return `
            <html>
                <head>
                    <style>
                        ${openSans}
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
