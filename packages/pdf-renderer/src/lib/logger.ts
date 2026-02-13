import { createJsonLogger } from "@leancodepl/logger"

export const defaultLogger = createJsonLogger()
export const pdfRendererLoggerSymbol = Symbol("PDF_RENDERER_LOGGER")
