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

function extractSessionTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return null
}

function extractCookies(req: Request): string | undefined {
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

  async validate(req: Request): Promise<KratosUser> {
    const sessionToken = extractSessionTokenFromHeader(req)
    const cookies = extractCookies(req)

    if (!sessionToken && !cookies) {
      throw new UnauthorizedException()
    }

    try {
      const { data: session } = await this.kratosClient.toSession({
        xSessionToken: sessionToken || undefined,
        cookie: cookies,
      })

      return {
        session,
        sessionToken: sessionToken || undefined,
      }
    } catch {
      throw new UnauthorizedException()
    }
  }
}
