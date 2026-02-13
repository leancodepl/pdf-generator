import { Global, Module } from "@nestjs/common"
import { LOGGER, logger } from "./logger"

@Global()
@Module({
  providers: [{ provide: LOGGER, useValue: logger }],
  exports: [LOGGER],
})
export class LoggerModule {}
