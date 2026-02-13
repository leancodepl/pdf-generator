import { HttpService } from "@nestjs/axios"
import { Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { JsonLogger } from "@leancodepl/logger"
import { Api, EndpointGetter } from "./api.service"
import { apiProxyLoggerSymbol } from "./logger"
import type { Request } from "express"

@Injectable()
export class CqrsClientFactory {
  constructor(
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly request: Request,
    @Inject(apiProxyLoggerSymbol) private readonly logger: JsonLogger,
  ) {}

  create(getApiEndpoint: EndpointGetter) {
    return new Api(this.httpService, this.request, getApiEndpoint, this.logger)
  }
}
