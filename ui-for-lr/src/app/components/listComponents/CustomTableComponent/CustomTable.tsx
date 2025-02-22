import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { DeleteIcon, EditIcon, EyeIcon } from "@nextui-org/shared-icons";
import "./style.css";
import { useRouter } from "next/router";

export type ActionType = "view" | "edit" | "delete";

export type Column<T> = {
    name: string;
    uid: keyof T | "actions";
};

type CustomTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    onDelete: (id: number) => void;
    actions?: ActionType[];
};
//@typescript-eslint/no-explicit-any
export default function CustomTable<T extends Record<string, any>>({
                                                                       data,
                                                                       columns,
                                                                       onDelete,
                                                                       actions = [],
                                                                   }: CustomTableProps<T>) {
    const router = useRouter();

    const modifiedColumns: Column<T>[] = actions.length
        ? [...columns, { name: "Дії", uid: "actions" }]
        : columns;

    const renderCell = (item: T, columnKey: keyof T | "actions") => {
        if (columnKey === "actions") {
            return (
                <div className="flex gap-2">
                    {actions.includes("view") && (
                        <span
                            className="cursor-pointer icon"
                            onClick={() => router.push(`${router.asPath}/${item.id}`)}
                        >
              <EyeIcon />
            </span>
                    )}
                    {actions.includes("edit") && (
                        <span
                            className="cursor-pointer icon"
                            onClick={() => router.push(`${router.asPath}/edit/${item.id}`)}
                        >
              <EditIcon />
            </span>
                    )}
                    {actions.includes("delete") && (
                        <span className="cursor-pointer icon" onClick={() => onDelete(item.id)}>
              <DeleteIcon />
            </span>
                    )}
                </div>
            );
        }
        return item[columnKey];
    };

    return (
        <Table aria-label="Custom Table" className="custom-table text-black">
            <TableHeader columns={modifiedColumns} className="custom-table">
                {(column: Column<T>) => (
                    <TableColumn key={String(column.uid)} align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={data}>
                {//@typescript-eslint/no-explicit-any
                    (item: any) => (
                    <TableRow key={item.id} className="table-row">
                        {/*@typescript-eslint/no-explicit-any*/}
                        {(columnKey: any) => (
                            <TableCell className={columnKey === "actions" ? "actions-cell" : ""}>
                                {renderCell(item, columnKey as keyof T | "actions")}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

