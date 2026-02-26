import { createJsonLogger } from "@leancodepl/logger"

export const logger = createJsonLogger()
export type AppLogger = typeof logger
export const LOGGER = Symbol("LOGGER")
