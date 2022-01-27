import { CqrsClientFactory } from "@leancodepl/api-proxy";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Client from "../Client";

@Injectable()
export class CqrsClient1 {
    client;
    constructor(cqrsClientFactory: CqrsClientFactory, private configService: ConfigService) {
        this.client = Client(cqrsClientFactory.create(this.getApiEndpoint));
    }

    getApiEndpoint(type: string) {
        return `${this.configService.get("API_BASE1")}${type}`;
    }
}
