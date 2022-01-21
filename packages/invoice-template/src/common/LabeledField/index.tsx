import * as React from "react";
import { ReactNode, FunctionComponent } from "react";
import styled from "styled-components";

type MarginTop = "small" | "medium" | "large";
type Orientation = "horizontal" | "vertical";

type LabeledFieldProps = {
    orientation: Orientation;
    label: ReactNode;
    value: ReactNode;
    marginTop?: MarginTop;
};

const LabeledField: FunctionComponent<LabeledFieldProps> = ({ orientation, label, value, marginTop }) => (
    <Root marginTop={marginTop} orientation={orientation}>
        <span>{label}</span>
        <Value>{value}</Value>
    </Root>
);

type RootProps = {
    marginTop?: MarginTop;
    orientation: Orientation;
};

const marginTopToPt = (marginTop: MarginTop) => {
    switch (marginTop) {
        case "small":
            return "10pt";
        case "medium":
            return "20pt";
        case "large":
            return "30pt";
    }
};

const Value = styled.span``;

const Root = styled.div<RootProps>`
    display: flex;
    flex-direction: ${({ orientation }) => (orientation === "horizontal" ? "row" : "column")};

    ${({ marginTop }) => (marginTop ? `margin: ${marginTopToPt(marginTop)};` : "")}

    ${Value} {
        margin-left: ${({ orientation }) => (orientation === "horizontal" ? "auto" : "0")};
    }
`;

export default LabeledField;
