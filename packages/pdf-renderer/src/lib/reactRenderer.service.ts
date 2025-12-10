import { ReactElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Injectable } from "@nestjs/common"
import { ServerStyleSheet } from "styled-components"
import { FontLibrary } from "./fontLibrary.service"

@Injectable()
export class ReactRenderer {
  constructor(private readonly fontLibrary: FontLibrary) {}

  generate(element: ReactElement, fonts: (string | symbol)[] = []) {
    const sheet = new ServerStyleSheet()
    const html = renderToStaticMarkup(sheet.collectStyles(element))

    const styleTags = sheet.getStyleTags()

    sheet.seal()

    return `
            <html>
                <head>
                    <style>
                        ${fonts.map(font => this.fontLibrary.getFont(font)).join("\n")}
                    </style>
                    ${styleTags}
                </head>
                <body>
                    ${html}
                </body>
            </html>
        `
  }

  generateWithHeaderAndFooter(
    element: ReactElement,
    headerElement?: ReactElement,
    footerElement?: ReactElement,
    fonts: (string | symbol)[] = [],
  ) {
    const sheet = new ServerStyleSheet()
    const html = renderToStaticMarkup(sheet.collectStyles(element))
    const headerHtml = headerElement && renderToStaticMarkup(sheet.collectStyles(headerElement))
    const footerHtml = footerElement && renderToStaticMarkup(sheet.collectStyles(footerElement))

    const styleTags = sheet.getStyleTags()

    sheet.seal()

    return `
            <html>
                <head>
                    <style>
                        @page {
                            margin: 0;
                        }
                        ${
                          headerHtml || footerHtml
                            ? "header { position: fixed; top: 0; } footer { position: fixed; bottom: 0; }"
                            : ""
                        }
                    </style>
                    <style>
                    ${fonts.map(font => this.fontLibrary.getFont(font)).join("\n")}
                    </style>
                    ${styleTags}
                </head>
                <body>
                    ${headerHtml ? `<header>${headerHtml}</header>` : ""}
                    ${html}
                    ${footerHtml ? `<footer>${footerHtml}</footer>` : ""}
                </body>
            </html>
        `
  }
}
