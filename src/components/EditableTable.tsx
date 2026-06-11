import React, {
    useMemo,
    useState,
    useCallback,
} from "react";

import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import Papa from "papaparse";

import { useTable } from "../context/TableContext";

import EditableCell from "./EditableCell";
import TableToolbar from "./TableToolbar";
import Pagination from "./Pagination";
import { Employee } from "../types/employee";

const EditableTable = () => {
    const { rows, setRows } = useTable();
    const [nameFilter, setNameFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [salaryFilter, setSalaryFilter] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [sortField, setSortField] = useState<keyof Employee>("id");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const [draftRow, setDraftRow] = useState<Employee | null>(null);
    const [undoHistory, setUndoHistory] = useState<Employee[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const handleExportCSV = () => {
        const csv = Papa.unparse(filteredAndSortedData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;", });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "employees.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClearFilters =
        useCallback(() => {
            setNameFilter("");
            setEmailFilter("");
            setSalaryFilter("");
        }, []);

    const filteredData = useMemo(() => {
        return rows.filter((item: Employee) => {
            const matchName =
                item.name
                    .toLowerCase()
                    .includes(
                        nameFilter.toLowerCase()
                    );

            const matchEmail =
                item.email
                    .toLowerCase()
                    .includes(
                        emailFilter.toLowerCase()
                    );

            const matchSalary =
                salaryFilter === ""
                    ? true
                    : item.salary >=
                    Number(salaryFilter);

            return (
                matchName &&
                matchEmail &&
                matchSalary
            );
        });
    }, [rows, nameFilter, emailFilter, salaryFilter,]);

    const filteredAndSortedData =
        useMemo(() => {
            const copied =
                [...filteredData];

            copied.sort((a, b) => {
                const fieldA =
                    a[sortField];

                const fieldB =
                    b[sortField];

                if (fieldA < fieldB)
                    return sortDirection ===
                        "asc"
                        ? -1
                        : 1;

                if (fieldA > fieldB)
                    return sortDirection ===
                        "asc"
                        ? 1
                        : -1;

                return 0;
            });

            return copied;
        }, [filteredData, sortField, sortDirection,]);

    const paginatedData =
        useMemo(() => {
            const start = page * rowsPerPage;

            const end = start + rowsPerPage;

            return filteredAndSortedData.slice(start, end);
        }, [filteredAndSortedData, page, rowsPerPage,]);

    const handleEdit = (row: Employee) => {
        setEditingRowId(row.id);
        setDraftRow({
            ...row,
        });
        setHasUnsavedChanges(false);
    };

    const handleCellChange = (field: keyof Employee, value: string | number) => {
        if (!draftRow) return;
        setDraftRow({
            ...draftRow,
            [field]: value,
        });
        setHasUnsavedChanges(true);
    };

    const handleSave = () => {
        if (!draftRow) return;
        const oldRow = rows.find((item: Employee) => item.id === draftRow.id);
        if (oldRow) {
            setUndoHistory(
                (prev) => [
                    ...prev,
                    oldRow,
                ]
            );
        }
        setRows((prev: Employee[]) =>
            prev.map((item: Employee) => item.id === draftRow.id ? draftRow : item)
        );
        setEditingRowId(null);
        setDraftRow(null);
        setHasUnsavedChanges(false);
    };

    const handleCancel = () => {
        setEditingRowId(null);
        setDraftRow(null);
        setHasUnsavedChanges(false);
    };

    const handleUndo = () => {
        if (undoHistory.length === 0) return;
        const previousRow = undoHistory[undoHistory.length - 1];
        setRows((prev: Employee[]) =>
            prev.map(
                (
                    item: Employee
                ) =>
                    item.id ===
                        previousRow.id
                        ? previousRow
                        : item
            )
        );
        setUndoHistory((prev) => prev.slice(0, -1));
    };

    const handleSort = (field: keyof Employee) => {
        if (sortField === field) {
            setSortDirection((prev) => prev === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const renderSortArrow = (field: keyof Employee) => {
        if (sortField !== field) return "";
        return sortDirection === "asc" ? " ↑" : " ↓";
    };

    React.useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [hasUnsavedChanges,]);

    const headers = [
        {
            label: "ID",
            key: "id",
        },
        {
            label: "Name",
            key: "name",
        },
        {
            label: "Email",
            key: "email",
        },
        {
            label: "Salary",
            key: "salary",
        },
    ] as const;
    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                m: 2,
                overflow: "hidden",
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: "bold",
                    mb: 2,
                }}
            >
                Employee Management Table
            </Typography>

            <TableToolbar
                nameFilter={nameFilter}
                emailFilter={emailFilter}
                salaryFilter={salaryFilter}
                setNameFilter={setNameFilter}
                setEmailFilter={setEmailFilter}
                setSalaryFilter={setSalaryFilter}
                onClearFilters={ handleClearFilters}
                onExportCSV={handleExportCSV}
                totalRows={filteredAndSortedData.length}
            />

            <Box sx={{
                mb: 2,
            }}
            >
                <Button
                    variant="outlined"
                    color="warning"
                    disabled={ undoHistory.length === 0}
                    onClick={handleUndo}
                >
                    Undo Last Change
                </Button>
            </Box>

            <Box
                sx={{
                    overflowX: "auto",
                    border: "1px solid #ddd",
                    borderRadius: 2,
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                        <tr>
                            {headers.map(
                                (header) => (
                                    <th
                                        key={header.key}
                                        onClick={() => handleSort( header.key )}
                                        style={{
                                            cursor: "pointer",
                                            padding: "12px",
                                            background: "#f5f5f5",
                                            borderBottom: "1px solid #ddd",
                                            textAlign: "left",
                                        }}
                                    >
                                        {header.label}
                                        {renderSortArrow(header.key)}
                                    </th>
                                )
                            )}

                            <th
                                style={{
                                    padding: "12px",
                                    background: "#f5f5f5",
                                    borderBottom: "1px solid #ddd",
                                }}
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.map((row: Employee) => {
                            const isEditing = editingRowId === row.id;
                            return (
                                <tr key={row.id} >
                                    <td
                                        style={{
                                            padding: "10px",
                                            borderBottom: "1px solid #eee",
                                        }}
                                    >
                                        {row.id}
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px",
                                            borderBottom: "1px solid #eee",
                                        }}
                                    >
                                        {isEditing &&
                                            draftRow ? (
                                            <EditableCell
                                                value={draftRow.name}
                                                onChange={(value) => handleCellChange("name", value)}
                                            />
                                        ) : (
                                            row.name
                                        )}
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px",
                                            borderBottom: "1px solid #eee",
                                        }}
                                    >
                                        {isEditing &&
                                            draftRow ? (
                                            <EditableCell
                                                value={draftRow.email}
                                                onChange={(value) => handleCellChange("email", value)}
                                            />
                                        ) : (
                                            row.email
                                        )}
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px",
                                            borderBottom: "1px solid #eee",
                                        }}
                                    >
                                        {isEditing &&
                                            draftRow ? (
                                            <EditableCell
                                                type="number"
                                                value={draftRow.salary}
                                                onChange={(value) => handleCellChange("salary", Number(value))}
                                            />
                                        ) : (
                                            `₹${row.salary.toLocaleString()}`
                                        )}
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px",
                                            borderBottom: "1px solid #eee",
                                        }}
                                    >
                                        {isEditing ? (
                                            <Stack
                                                direction="row"
                                                spacing={
                                                    1
                                                }
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={handleSave}
                                                >
                                                    Save
                                                </Button>

                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={handleCancel}
                                                >
                                                    Cancel
                                                </Button>
                                            </Stack>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleEdit(row)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            );
                        }
                        )}

                        {paginatedData.length ===
                            0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        style={{
                                            padding: "20px",
                                            textAlign: "center",
                                        }}
                                    >
                                        No Data Found
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </Box>
            <Pagination
                page={page}
                rowsPerPage={rowsPerPage}
                totalRows={filteredAndSortedData.length}
                onPageChange={setPage}
                onRowsPerPageChange={(value) => {
                    setRowsPerPage(value);
                    setPage(0);
                }}
            />
        </Paper>
    );
};

export default EditableTable;