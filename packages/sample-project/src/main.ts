import { NestFactory } from "@nestjs/core"
import { createNestJsonLogger } from "@leancodepl/logger"
import { AppModule } from "./app/app.module"
import { logger } from "./app/logger"

async function bootstrap() {
  logger.info("Starting application")
  const app = await NestFactory.create(AppModule, {
    logger: createNestJsonLogger(),
  })

  app.enableShutdownHooks()

  const globalPrefix = "api"
  app.setGlobalPrefix(globalPrefix)
  const port = process.env.PORT || 3333
  await app.listen(port)

  logger.success(`Application is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap().catch(err => {
  logger.error("Application failed to start", err)
  process.exit(1)
})
