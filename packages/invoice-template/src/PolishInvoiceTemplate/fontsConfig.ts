import { FontsConfiguration } from "@leancodepl/pdf-renderer"

export const FontRegular = Symbol("FontRegular")
export const FontBold = Symbol("FontBold")

export const moduleConfig = ({
  regular,
  bold,
}: {
  regular: Buffer | string
  bold: Buffer | string
}): FontsConfiguration => ({
  [FontRegular]: {
    fontFamily: "Font",
    fontFile: regular,
    fontStyle: "normal",
    fontWeight: 400,
  },
  [FontBold]: {
    fontFamily: "Font",
    fontFile: bold,
    fontStyle: "normal",
    fontWeight: 600,
  },
})

export const pdfRendererConfig = [FontRegular, FontBold]
