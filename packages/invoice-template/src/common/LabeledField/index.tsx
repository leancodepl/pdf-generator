import * as React from "react";
import styled from "styled-components";

type Orientation = "horizontal" | "vertical";

type LabeledFieldProps = {
    orientation: Orientation;
    label: React.ReactNode;
    value: React.ReactNode;
    margin?: string;
};

const LabeledField: React.FunctionComponent<LabeledFieldProps> = ({ orientation, label, value, margin }) => (
    <Root margin={margin} orientation={orientation}>
        <Label>{label}</Label>
        <Value orientation={orientation}>{value}</Value>
    </Root>
);

type OrientationProps = {
    orientation: Orientation;
};

type RootProps = {
    margin?: string;
} & OrientationProps;

const Root = styled.div<RootProps>`
    display: flex;
    flex-direction: ${props => (props.orientation === "horizontal" ? "row" : "column")};

    ${props => (props.margin ? `margin: ${props.margin};` : "")}
`;

const Label = styled.span``;

const Value = styled.span<OrientationProps>`
    margin-left: ${props => (props.orientation === "horizontal" ? "auto" : "0")};
`;

export default LabeledField;
