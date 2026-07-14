import type { Request } from "express"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Configuration, FrontendApi } from "@ory/client"
import { Strategy } from "passport-custom"

export type KratosStrategyConfig = {
  kratosPublicUrl: string
}

const bearerPrefix = "Bearer "

function extractSessionTokenFromHeader(req: Request) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith(bearerPrefix)) {
    return authHeader.slice(bearerPrefix.length)
  }
  return
}

function extractCookies(req: Request) {
  return req.headers.cookie || undefined
}

@Injectable()
export class KratosStrategy extends PassportStrategy(Strategy, "kratos") {
  private readonly kratosClient: FrontendApi

  constructor(kratosStrategyConfig: KratosStrategyConfig) {
    super()

    this.kratosClient = new FrontendApi(
      new Configuration({
        basePath: kratosStrategyConfig.kratosPublicUrl,
      }),
    )
  }

  async validate(req: Request) {
    const token = extractSessionTokenFromHeader(req)
    const cookie = extractCookies(req)

    if (!token && !cookie) {
      throw new UnauthorizedException()
    }

    try {
      await this.kratosClient.toSession({
        xSessionToken: token,
        cookie: cookie,
      })

      return {
        token,
        cookie,
      }
    } catch {
      throw new UnauthorizedException()
    }
  }
}
