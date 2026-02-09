import { HttpService } from "@nestjs/axios"
import { Injectable } from "@nestjs/common"
import { firstValueFrom } from "rxjs"
import { map } from "rxjs/operators"
import { CommandResult } from "@leancodepl/cqrs-client-base"
import { CqrsClient } from "./cqrsClient"
import type { Request } from "express"

export type EndpointGetter = (type: string) => string

@Injectable()
export class Api implements CqrsClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly request: Request,
    private readonly getApiEndpoint: EndpointGetter,
  ) {}

  createQuery<TQuery, TResult>(type: string) {
    return (dto: TQuery) => this.run<TResult>(this.getApiEndpoint(type), dto)
  }

  createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(type: string) {
    return (dto: TCommand) => this.run<CommandResult<TErrorCodes>>(this.getApiEndpoint(type), dto)
  }

  private run<TResult>(url: string, data: any): Promise<TResult> {
    const token: string | undefined = (this.request as any).user?.token
    const cookie: string | undefined = (this.request as any).user?.cookie

    return firstValueFrom(
      this.httpService
        .post<TResult>(url, data, {
          headers: { Authorization: token && `Bearer ${token}`, Cookie: cookie },
        })
        .pipe(map(response => response.data)),
    ).catch(e => {
      console.error("Request with url ", url, "and data", data, "failed")
      return Promise.reject(e)
    })
  }
}
