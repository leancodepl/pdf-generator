import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { Api, EndpointGetter } from "./api.service";

@Injectable()
export class CqrsClientFactory {
    constructor(private readonly httpService: HttpService, @Inject(REQUEST) private readonly request: Request) {}

    create(getApiEndpoint: EndpointGetter) {
        return new Api(this.httpService, this.request, getApiEndpoint);
    }
}
