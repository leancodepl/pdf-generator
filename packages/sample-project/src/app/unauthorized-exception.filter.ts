import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, UnauthorizedException } from "@nestjs/common"
import type { AppLogger } from "./logger"

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<{ method?: string; url?: string }>()
    const res = ctx.getResponse<{
      status: (code: number) => { json: (body: unknown) => void }
      json: (body: unknown) => void
    }>()
    const body = exception.getResponse()
    const status = exception.getStatus()
    const method = req.method ?? "?"
    const path = req.url ?? "?"

    this.logger.warn(
      "Unauthorized",
      `${method} ${path}`,
      typeof body === "object" && body !== null ? JSON.stringify(body) : String(body),
    )

    const responseBody =
      typeof body === "object" && body !== null
        ? body
        : { message: "Unauthorized", statusCode: HttpStatus.UNAUTHORIZED }
    res.status(status).json(responseBody)
  }
}
