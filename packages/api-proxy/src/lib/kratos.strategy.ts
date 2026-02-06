import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Configuration, FrontendApi, Session } from "@ory/client"
import { Strategy } from "passport-custom"
import type { Request } from "express"

export type KratosStrategyConfig = {
  kratosPublicUrl: string
}

export type KratosUser = {
  session: Session
  sessionToken?: string
}

const bearerPrefix = "Bearer "

function extractSessionTokenFromHeader(req: Request) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith(bearerPrefix)) {
    return authHeader.substring(bearerPrefix.length)
  }
  return undefined
}

function extractCookies(req: Request) {
  const cookieHeader = req.headers.cookie
  return cookieHeader || undefined
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
    const sessionToken = extractSessionTokenFromHeader(req)
    const cookies = extractCookies(req)

    if (!sessionToken && !cookies) {
      throw new UnauthorizedException()
    }

    try {
      await this.kratosClient.toSession({
        xSessionToken: sessionToken || undefined,
        cookie: cookies,
      })

      return {
        token: sessionToken,
        cookie: cookies,
      }
    } catch {
      throw new UnauthorizedException()
    }
  }
}
