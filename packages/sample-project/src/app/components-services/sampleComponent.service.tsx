import React = require("react");
import { Injectable } from "@nestjs/common";
import SampleComponent from "../components/SampleComponent";

@Injectable()
export class SampleComponentService {
    getComponent() {
        return <SampleComponent />;
    }
}
