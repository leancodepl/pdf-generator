import { TextEncoder, TextDecoder } from "util"

Object.assign(global, { TextDecoder, TextEncoder })

jest.mock("@leancodepl/logger", () => ({
  createJsonLogger: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }),
  createCliLogger: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }),
}))
