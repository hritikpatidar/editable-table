import React, { useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import Papa from "papaparse";

import { RootState, AppDispatch } from "../redux/store";
import {
    setNameFilter,
    setEmailFilter,
    setSalaryFilter,
    clearFilters,
} from "../redux/slices/filtersSlice";
import {
    setPage,
    setRowsPerPage,
} from "../redux/slices/paginationSlice";
import {
    setSortField,
    setSortDirection,
    setSort,
} from "../redux/slices/sortSlice";
import {
    startEditing,
    updateDraftRow,
    cancelEditing,
    clearEditing,
} from "../redux/slices/editingSlice";
import {
    updateRow,
    undo,
    clearUndoHistory,
} from "../redux/slices/tableDataSlice";

import EditableCell from "./EditableCell";
import TableToolbar from "./TableToolbar";
import Pagination from "./Pagination";
import { Employee } from "../types/employee";

const EditableTable = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Redux selectors
    const rows = useSelector((state: RootState) => state.tableData.rows);
    const undoHistory = useSelector((state: RootState) => state.tableData.undoHistory);
    const nameFilter = useSelector((state: RootState) => state.filters.nameFilter);
    const emailFilter = useSelector((state: RootState) => state.filters.emailFilter);
    const salaryFilter = useSelector((state: RootState) => state.filters.salaryFilter);
    const page = useSelector((state: RootState) => state.pagination.page);
    const rowsPerPage = useSelector((state: RootState) => state.pagination.rowsPerPage);
    const sortField = useSelector((state: RootState) => state.sort.sortField);
    const sortDirection = useSelector((state: RootState) => state.sort.sortDirection);
    const editingRowId = useSelector((state: RootState) => state.editing.editingRowId);
    const draftRow = useSelector((state: RootState) => state.editing.draftRow);
    const hasUnsavedChanges = useSelector((state: RootState) => state.editing.hasUnsavedChanges);

    const handleExportCSV = () => {
        const csv = Papa.unparse(filteredAndSortedData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "employees.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClearFilters = useCallback(() => {
        dispatch(clearFilters());
    }, [dispatch]);

    const filteredData = useMemo(() => {
        return rows.filter((item: Employee) => {
            const matchName = item.name
                .toLowerCase()
                .includes(nameFilter.toLowerCase());

            const matchEmail = item.email
                .toLowerCase()
                .includes(emailFilter.toLowerCase());

            const matchSalary =
                salaryFilter === ""
                    ? true
                    : item.salary >= Number(salaryFilter);

            return matchName && matchEmail && matchSalary;
        });
    }, [rows, nameFilter, emailFilter, salaryFilter]);

    const filteredAndSortedData = useMemo(() => {
        const copied = [...filteredData];

        copied.sort((a, b) => {
            const fieldA = a[sortField];
            const fieldB = b[sortField];

            if (fieldA < fieldB)
                return sortDirection === "asc" ? -1 : 1;

            if (fieldA > fieldB)
                return sortDirection === "asc" ? 1 : -1;

            return 0;
        });

        return copied;
    }, [filteredData, sortField, sortDirection]);

    const paginatedData = useMemo(() => {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredAndSortedData.slice(start, end);
    }, [filteredAndSortedData, page, rowsPerPage]);

    const handleEdit = (row: Employee) => {
        dispatch(
            startEditing({
                rowId: row.id,
                draftRow: { ...row },
            })
        );
    };

    const handleCellChange = (field: keyof Employee, value: string | number) => {
        if (!draftRow) return;
        dispatch(
            updateDraftRow({
                ...draftRow,
                [field]: value,
            })
        );
    };

    const handleSave = () => {
        if (!draftRow) return;
        dispatch(updateRow(draftRow));
        dispatch(clearEditing());
    };

    const handleCancel = () => {
        dispatch(cancelEditing());
    };

    const handleUndo = () => {
        if (undoHistory.length === 0) return;
        dispatch(undo());
    };

    const handleSort = (field: keyof Employee) => {
        if (sortField === field) {
            dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
        } else {
            dispatch(setSort({ sortField: field, sortDirection: "asc" }));
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
    }, [hasUnsavedChanges]);

    const headers = [
        { label: "ID", key: "id" },
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Salary", key: "salary" },
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
                setNameFilter={(val) => dispatch(setNameFilter(val))}
                setEmailFilter={(val) => dispatch(setEmailFilter(val))}
                setSalaryFilter={(val) => dispatch(setSalaryFilter(val))}
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
                                        <TableCell align="center" sx={{ minWidth: 280 }}>
                                            {isEditing ? (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        gap: 1,
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Tooltip title="Save changes">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            startIcon={<SaveIcon />}
                                                            onClick={handleSave}
                                                            sx={{
                                                                minWidth: 95,
                                                                height: 36,
                                                                background: "linear-gradient(135deg, var(--success) 0%, #059669 100%)",
                                                                textTransform: "none",
                                                                color: "var(--text)",
                                                                backgroundColor: "var(--primary)",
                                                                fontWeight: 600,
                                                                borderRadius: "6px",
                                                                boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)",
                                                                transition: "all 0.2s",
                                                                "&:hover": {
                                                                    boxShadow: "0 4px 8px rgba(16, 185, 129, 0.3)",
                                                                    transform: "translateY(-1px)",
                                                                },
                                                                fontSize: "0.85rem",
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
                                                                minWidth: 95,
                                                                height: 36,
                                                                borderColor: "var(--danger)",
                                                                color: "var(--danger)",
                                                                textTransform: "none",
                                                                fontWeight: 600,
                                                                borderRadius: "6px",
                                                                transition: "all 0.2s",
                                                                border: "1.5px solid var(--danger)",
                                                                "&:hover": {
                                                                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                                                                    borderColor: "var(--danger)",
                                                                    borderWidth: "1.5px",
                                                                },
                                                                fontSize: "0.85rem",
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Tooltip>
                                                </Box>
                                            ) : (
                                                <Tooltip title="Edit this record">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleEdit(row)}
                                                        sx={{
                                                            minWidth: 100,
                                                            height: 36,
                                                            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
                                                            color: "var(--text)",
                                                            backgroundColor: "var(--primary)",
                                                            textTransform: "none",
                                                            fontWeight: 600,
                                                            borderRadius: "6px",
                                                            boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                                                            transition: "all 0.2s",
                                                            "&:hover": {
                                                                boxShadow: "0 4px 8px rgba(37, 99, 235, 0.3)",
                                                                transform: "translateY(-1px)",
                                                            },
                                                            fontSize: "0.85rem",
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
                onPageChange={(newPage) => dispatch(setPage(newPage))}
                onRowsPerPageChange={(value) => {
                    dispatch(setRowsPerPage(value));
                }}
            />
        </Paper>
    );
};

export default EditableTable;
