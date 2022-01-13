import * as React from "react";
import styled from "styled-components";

const SampleComponent: React.FunctionComponent = () => <BlueDiv>sample pdf generator component</BlueDiv>;

const BlueDiv = styled.div`
    background: lightskyblue;

    color: white;
`;

export default SampleComponent;
