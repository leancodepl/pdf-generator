import { createJsonLogger } from "@leancodepl/logger"

export const defaultLogger = createJsonLogger()
export const apiProxyLoggerSymbol = Symbol("API_PROXY_LOGGER")
