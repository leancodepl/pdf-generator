import * as React from "react";
import styled from "styled-components";

export type TableColumns = {
    title: string;
    dataIndex: string;
    alignment?: "left" | "center" | "right";
    width?: string;
}[];

export type TableData = Record<string, string>[];

type TableProps = {
    columns: TableColumns;
    data: TableData;
    className?: string;
};

const Table: React.FunctionComponent<TableProps> = ({ columns, data, className }) => (
    <table className={className}>
        <thead>
            <tr>
                {columns.map(column => (
                    <Th key={column.dataIndex} alignment="center" width={column.width}>
                        {column.title}
                    </Th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.map((row, index) => (
                <tr key={`row${index}`}>
                    {columns.map(column => (
                        <Td key={`${column.dataIndex}${index}`} alignment={column.alignment} width={column.width}>
                            {row[column.dataIndex]}
                        </Td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

type TableCellProps = {
    width?: string;
    alignment?: string;
};

const Th = styled.th<TableCellProps>`
    font-weight: 400;

    ${props => (props.width ? `width: ${props.width};` : "")}
    ${props => (props.alignment ? `text-align: ${props.alignment};` : "")}
`;

const Td = styled.td<TableCellProps>`
    padding: 1px 2px;

    ${props => (props.width ? `max-width: ${props.width}; width: ${props.width};` : "")}
    ${props => (props.alignment ? `text-align: ${props.alignment};` : "")}
`;

export default Table;
