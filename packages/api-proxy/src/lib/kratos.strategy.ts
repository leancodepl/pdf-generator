import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Configuration, FrontendApi, Session } from "@ory/client"
import { Strategy } from "passport-custom"
import type { Request } from "express"

export type KratosStrategyConfig = {
  /**
   * The base URL of the Ory Kratos public API
   * For Ory Network: https://{project-slug}.projects.oryapis.com
   * For self-hosted: http://localhost:4433 (or your Kratos public URL)
   */
  kratosPublicUrl: string
}

export type KratosUser = {
  session: Session
  sessionToken?: string
}

/**
 * Extracts session token from Authorization header (Bearer token)
 */
function extractSessionTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return null
}

/**
 * Extracts session cookie string from request
 */
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
      throw new Error("No session token or cookie provided")
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
    } catch (error: unknown) {
      // Ory client throws on 401/403 responses
      const errorMessage = error instanceof Error ? error.message : "Session verification failed"
      throw new Error(`Kratos session verification failed: ${errorMessage}`)
    }
  }
}
