import React = require("react");
import { Injectable } from "@nestjs/common";
import SampleComponent from "../components/SampleComponent";
import { CqrsClient1 } from "./CqrsClient1";

@Injectable()
export class Query1ComponentService {
    constructor(private client: CqrsClient1) {}

    async getComponent() {
        const test = await this.client.client.TestQueries.TestQuery1({});
        return <SampleComponent testString={test.test} />;
    }
}
