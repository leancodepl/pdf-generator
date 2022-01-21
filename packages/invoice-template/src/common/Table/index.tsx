import * as React from "react";
import { FunctionComponent } from "react";
import styled from "styled-components";

export type TableColumns = {
    title: string;
    dataIndex: string;
    alignment?: "left" | "center" | "right";
    width?: string;
}[];

export type TableData = Record<string, string>[];

export type TableProps = {
    columns: TableColumns;
    data: TableData;
    className?: string;
};

const Table: FunctionComponent<TableProps> = ({ columns, data, className }) => (
    <table className={className}>
        <colgroup>
            {columns.map((column, index) => (
                <col key={index} span={1} style={{ width: column.width }} />
            ))}
        </colgroup>
        <thead>
            <tr>
                {columns.map(column => (
                    <Th key={column.dataIndex} alignment="center">
                        {column.title}
                    </Th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.map((row, index) => (
                <tr key={index}>
                    {columns.map((column, index) => (
                        <Td key={index} alignment={column.alignment}>
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

    ${({ alignment }) => (alignment ? `text-align: ${alignment};` : "")}
`;

const Td = styled.td<TableCellProps>`
    padding: 1pt 2pt;

    ${({ alignment }) => (alignment ? `text-align: ${alignment};` : "")}
`;

export default Table;
