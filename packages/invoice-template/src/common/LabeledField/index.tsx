import * as React from "react";
import { ReactNode, FunctionComponent } from "react";
import styled from "styled-components";

type Orientation = "horizontal" | "vertical";

type LabeledFieldProps = {
    orientation: Orientation;
    label: ReactNode;
    value: ReactNode;
    margin?: string;
};

const LabeledField: FunctionComponent<LabeledFieldProps> = ({ orientation, label, value, margin }) => (
    <Root margin={margin} orientation={orientation}>
        <span>{label}</span>
        <Value>{value}</Value>
    </Root>
);

type RootProps = {
    margin?: string;
    orientation: Orientation;
};

const Value = styled.span``;

const Root = styled.div<RootProps>`
    display: flex;
    flex-direction: ${({ orientation }) => (orientation === "horizontal" ? "row" : "column")};

    ${({ margin }) => (margin ? `margin: ${margin};` : "")}

    ${Value} {
        margin-left: ${({ orientation }) => (orientation === "horizontal" ? "auto" : "0")};
    }
`;

export default LabeledField;
