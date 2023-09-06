import { Injectable } from "@nestjs/common";
import { CqrsClient1 } from "./CqrsClient1";
import SampleComponent from "../components/SampleComponent";

@Injectable()
export class Query1ComponentService {
    constructor(private client: CqrsClient1) {}

    async getComponent() {
        const test = await this.client.client.TestQueries.TestQuery1({});
        return <SampleComponent testString={test.test} />;
    }
}
