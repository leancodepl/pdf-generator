import { Api, EndpointGetter } from "@leancodepl/api-proxy";
import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";

@Injectable()
export class CqrsClientFactory {
    constructor(private readonly httpService: HttpService, @Inject(REQUEST) private readonly request: Request) {}

    create(getApiEndpoint: EndpointGetter) {
        return new Api(this.httpService, this.request, getApiEndpoint);
    }
}
