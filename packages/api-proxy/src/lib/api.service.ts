import { CommandResult } from "@leancode/cqrs-client-base";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import type { Request } from "express";
import { firstValueFrom } from "rxjs";
import { map } from "rxjs/operators";
import { CqrsClient } from "./cqrsClient";

export type EndpointGetter = (type: string) => string;

@Injectable()
export class Api implements CqrsClient {
    constructor(
        private httpService: HttpService,
        private request: Request,
        private readonly getApiEndpoint: EndpointGetter,
    ) {}

    createQuery<TQuery, TResult>(type: string) {
        return (dto: TQuery) => this.run<TResult>(this.getApiEndpoint(type), dto);
    }

    createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(type: string) {
        return (dto: TCommand) => this.run<CommandResult<TErrorCodes>>(this.getApiEndpoint(type), dto);
    }

    private run<TResult>(url: string, data: any): Promise<TResult> {
        const token: string = (this.request as any).user?.token;

        return firstValueFrom(
            this.httpService
                .post<TResult>(url, data, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .pipe(map(response => response.data)),
        ).catch(e => {
            console.error("Request with url ", url, "and data", data, "failed");
            return Promise.reject(e);
        });
    }
}
