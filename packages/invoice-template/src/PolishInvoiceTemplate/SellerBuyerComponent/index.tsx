import { FunctionComponent } from "react";
import styled from "styled-components";
import LabeledField from "../../common/LabeledField";

export type SellerBuyerData = {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    addressLine3?: string;
    taxId?: string;
    additionalFields?: SellerBuyerAdditionalField[];
};

type SellerBuyerAdditionalField = {
    label: string;
    value: string;
};

type SellerBuyerComponentProps = {
    data: SellerBuyerData;
    type: "seller" | "buyer";
};

export const SellerBuyerComponent: FunctionComponent<SellerBuyerComponentProps> = ({
    data: { name, addressLine1, addressLine2, addressLine3, taxId, additionalFields },
    type,
}) => (
    <Root>
        <Header>{type === "seller" ? "Sprzedawca" : "Nabywca"}</Header>
        <BiggerFontWrapper>
            <b>
                <div>{name}</div>
                <div>{addressLine1}</div>
                {addressLine2 && <div>{addressLine2}</div>}
                {addressLine3 && <div>{addressLine3}</div>}
            </b>
            {taxId && (
                <LabeledField disableAutoLeftMargin label="NIP:" orientation="horizontal" value={<b>{taxId}</b>} />
            )}
        </BiggerFontWrapper>
        {additionalFields?.map(({ label, value }) => (
            <LabeledField
                key={label}
                disableAutoLeftMargin
                label={label}
                orientation="horizontal"
                value={<b>{value}</b>}
            />
        ))}
    </Root>
);

const Root = styled.div`
    display: flex;
    flex-direction: column;

    margin-right: 45pt;

    font-size: 10pt;
`;

const Header = styled.div`
    width: 100%;

    margin-bottom: 2pt;

    font-size: 13pt;
    font-weight: bold;

    border-bottom: 2px solid black;
`;

const BiggerFontWrapper = styled.div`
    font-size: 11pt;
`;
