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
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    TableContainer,
    Chip,
    Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

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
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                overflow: "hidden",
                border: "1px solid var(--border)",
                borderRadius: 1.5,
                backgroundColor: "var(--bg)",
            }}
        >
            {/* Main Content */}
            <Box sx={{ mb: 0 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: "var(--text)",
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                >
                    Employee Records
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: "var(--text-light)",
                        mb: 2,
                    }}
                >
                    Manage and edit employee information with inline editing and instant updates.
                </Typography>
            </Box>

            {/* Toolbar */}
            <TableToolbar
                nameFilter={nameFilter}
                emailFilter={emailFilter}
                salaryFilter={salaryFilter}
                setNameFilter={setNameFilter}
                setEmailFilter={setEmailFilter}
                setSalaryFilter={setSalaryFilter}
                onClearFilters={handleClearFilters}
                onExportCSV={handleExportCSV}
                onUndo={handleUndo}
                undoAvailable={undoHistory.length > 0}
                totalRows={filteredAndSortedData.length}
            />

            {/* Table Container */}
            <TableContainer
                sx={{
                    borderRadius: 1,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow)",
                    mb: 0,
                }}
            >
                <Table
                    sx={{
                        "& .MuiTableCell-root": {
                            borderColor: "var(--border-light)",
                            py: 1.25,
                            px: 1.5,
                        },
                        "& .MuiTableCell-head": {
                            py: 1.5,
                            px: 1.5,
                        },
                    }}
                >
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: "var(--bg-light)",
                                "& .MuiTableCell-head": {
                                    backgroundColor: "var(--bg-light)",
                                    borderColor: "var(--border)",
                                    fontWeight: 700,
                                    color: "var(--text)",
                                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                                    py: 1.5,
                                    px: 1.5,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                },
                            }}
                        >
                            {headers.map((header) => (
                                <TableCell
                                    key={header.key}
                                    align={header.key === "salary" ? "right" : "left"}
                                    sx={{
                                        cursor: "pointer",
                                        userSelect: "none",
                                        transition: "background-color 0.2s",
                                        "&:hover": {
                                            backgroundColor: "rgba(37, 99, 235, 0.05)",
                                        },
                                    }}
                                >
                                    <TableSortLabel
                                        active={sortField === header.key}
                                        direction={sortField === header.key ? sortDirection : "asc"}
                                        onClick={() => handleSort(header.key)}
                                        sx={{
                                            "& .MuiTableSortLabel-icon": {
                                                color: "var(--primary) !important",
                                            },
                                        }}
                                    >
                                        {header.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    color: "var(--text)",
                                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                                    py: 2,
                                }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    align="center"
                                    sx={{
                                        py: 4,
                                        color: "var(--text-lighter)",
                                    }}
                                >
                                    <Typography variant="body2">
                                        No employee records found. Try adjusting your filters.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((row: Employee, index) => {
                                const isEditing = editingRowId === row.id;
                                const rowBg = index % 2 === 0 ? "transparent" : "rgba(0, 0, 0, 0.01)";

                                return (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            backgroundColor: rowBg,
                                            transition: "background-color 0.2s",
                                            height: 60,
                                            "&:hover": {
                                                backgroundColor: isEditing
                                                    ? rowBg
                                                    : "rgba(37, 99, 235, 0.03)",
                                            },
                                            "& .MuiTableCell-body": {
                                                py: 1.25,
                                                px: 1.5,
                                                fontSize: { xs: "0.85rem", md: "0.9rem" },
                                                verticalAlign: "middle",
                                            },
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                fontWeight: 500,
                                                color: "var(--text-light)",
                                                minWidth: { xs: "50px", sm: "60px" },
                                            }}
                                        >
                                            <Chip
                                                label={`#${row.id}`}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    borderColor: "var(--border)",
                                                    color: "var(--text-light)",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                minWidth: { xs: "120px", sm: "150px" },
                                            }}
                                        >
                                            {isEditing && draftRow ? (
                                                <EditableCell
                                                    value={draftRow.name}
                                                    onChange={(value) =>
                                                        handleCellChange("name", value)
                                                    }
                                                />
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 500,
                                                        color: "var(--text)",
                                                    }}
                                                >
                                                    {row.name}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                minWidth: { xs: "140px", sm: "180px" },
                                            }}
                                        >
                                            {isEditing && draftRow ? (
                                                <EditableCell
                                                    value={draftRow.email}
                                                    onChange={(value) =>
                                                        handleCellChange("email", value)
                                                    }
                                                />
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "var(--text-light)",
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    {row.email}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{
                                                minWidth: { xs: "100px", sm: "140px" },
                                            }}
                                        >
                                            {isEditing && draftRow ? (
                                                <EditableCell
                                                    type="number"
                                                    value={draftRow.salary}
                                                    onChange={(value) =>
                                                        handleCellChange(
                                                            "salary",
                                                            Number(value)
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: "var(--success)",
                                                    }}
                                                >
                                                    ₹{row.salary.toLocaleString("en-IN")}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {isEditing ? (
                                                <Stack
                                                    direction="row"
                                                    spacing={0.5}
                                                    sx={{
                                                        justifyContent: "center",
                                                        flexWrap: "wrap",
                                                        gap: { xs: 0.5, sm: 1 },
                                                    }}
                                                >
                                                    <Tooltip title="Save changes">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            startIcon={<SaveIcon />}
                                                            onClick={handleSave}
                                                            sx={{
                                                                minWidth: 110,
                                                                background: "linear-gradient(135deg, var(--success) 0%, #059669 100%)",
                                                                textTransform: "none",
                                                                fontWeight: 600,
                                                                color: "var(--text)",
                                                                borderRadius: "6px",
                                                                boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)",
                                                                transition: "all 0.2s",
                                                                "&:hover": {
                                                                    boxShadow: "0 4px 8px rgba(16, 185, 129, 0.3)",
                                                                    transform: "translateY(-1px)",
                                                                },
                                                                fontSize: { xs: "0.78rem", sm: "0.875rem" },
                                                                px: { xs: 1, sm: 1.5 },
                                                            }}
                                                        >
                                                            Save
                                                        </Button>
                                                    </Tooltip>

                                                    <Tooltip title="Discard changes">
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<CancelIcon />}
                                                            onClick={handleCancel}
                                                            sx={{
                                                                minWidth: 110,
                                                                borderColor: "var(--danger)",
                                                                color: "var(--danger)",
                                                                textTransform: "none",
                                                                fontWeight: 600,
                                                                borderRadius: "6px",
                                                                transition: "all 0.2s",
                                                                "&:hover": {
                                                                    backgroundColor:
                                                                        "rgba(239, 68, 68, 0.08)",
                                                                    borderColor: "var(--danger)",
                                                                },
                                                                fontSize: { xs: "0.78rem", sm: "0.875rem" },
                                                                px: { xs: 1, sm: 1.5 },
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Tooltip>
                                            </Stack>
                                            ) : (
                                                <Tooltip title="Edit this record">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleEdit(row)}
                                                        sx={{
                                                            minWidth: 110,
                                                            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
                                                            textTransform: "none",
                                                            color: "var(--text)",
                                                            fontWeight: 600,
                                                            borderRadius: "6px",
                                                            boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                                                            transition: "all 0.2s",
                                                            "&:hover": {
                                                                boxShadow: "0 4px 8px rgba(37, 99, 235, 0.3)",
                                                                transform: "translateY(-1px)",
                                                            },
                                                            fontSize: { xs: "0.78rem", sm: "0.875rem" },
                                                            px: { xs: 1, sm: 1.5 },
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
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