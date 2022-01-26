import { CqrsClientFactory } from "@leancodepl/api-proxy";
import { Injectable } from "@nestjs/common";
import Client from "../Client";

@Injectable()
export class CqrsClient1 {
    client;
    constructor(cqrsClientFactory: CqrsClientFactory) {
        this.client = Client(cqrsClientFactory.create(CqrsClient1.getApiEndpoint));
    }

    static getApiEndpoint(type: string) {
        return `http://localhost:3333/api/${type}`;
    }
}
