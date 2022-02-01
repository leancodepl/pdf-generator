import { render } from "@testing-library/react";
import { PolishInvoiceTemplate } from ".";
import { polishInvoiceTestProps } from "./testData";

describe("PolishInvoiceTemplate", () => {
    let component: HTMLElement;

    beforeAll(() => {
        component = render(<PolishInvoiceTemplate {...polishInvoiceTestProps} />).baseElement as HTMLElement;
    });

    it("should render a component without errors", () => {
        expect(component).toBeTruthy();
    });
});
