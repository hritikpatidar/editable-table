import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Tooltip,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

interface TableToolbarProps {
    nameFilter: string;
    emailFilter: string;
    salaryFilter: string;
    setNameFilter: (value: string) => void;
    setEmailFilter: (value: string) => void;
    setSalaryFilter: (value: string) => void;
    onClearFilters: () => void;
    onExportCSV: () => void;
    onUndo: () => void;
    undoAvailable: boolean;
    totalRows: number;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
    nameFilter,
    emailFilter,
    salaryFilter,
    setNameFilter,
    setEmailFilter,
    setSalaryFilter,
    onClearFilters,
    onExportCSV,
    onUndo,
    undoAvailable,
    totalRows,
}) => {
    const inputHeight = 40;
    const [localName, setLocalName] = useState(nameFilter);
    const [localEmail, setLocalEmail] = useState(emailFilter);
    const [localSalary, setLocalSalary] = useState(salaryFilter);

    const nameDebounce = useRef<number | null>(null);
    const emailDebounce = useRef<number | null>(null);
    const salaryDebounce = useRef<number | null>(null);

    // Sync incoming prop changes (e.g., on rehydrate) into local inputs
    useEffect(() => setLocalName(nameFilter), [nameFilter]);
    useEffect(() => setLocalEmail(emailFilter), [emailFilter]);
    useEffect(() => setLocalSalary(salaryFilter), [salaryFilter]);

    // Debounce updates to avoid frequent dispatches / persistence on each keystroke
    useEffect(() => {
        if (nameDebounce.current) window.clearTimeout(nameDebounce.current);
        nameDebounce.current = window.setTimeout(() => setNameFilter(localName), 300) as unknown as number;
        return () => { if (nameDebounce.current) window.clearTimeout(nameDebounce.current); };
    }, [localName, setNameFilter]);

    useEffect(() => {
        if (emailDebounce.current) window.clearTimeout(emailDebounce.current);
        emailDebounce.current = window.setTimeout(() => setEmailFilter(localEmail), 300) as unknown as number;
        return () => { if (emailDebounce.current) window.clearTimeout(emailDebounce.current); };
    }, [localEmail, setEmailFilter]);

    useEffect(() => {
        if (salaryDebounce.current) window.clearTimeout(salaryDebounce.current);
        salaryDebounce.current = window.setTimeout(() => setSalaryFilter(localSalary), 300) as unknown as number;
        return () => { if (salaryDebounce.current) window.clearTimeout(salaryDebounce.current); };
    }, [localSalary, setSalaryFilter]);

    const handleClear = () => {
        // Clear persisted filters immediately and reset local inputs
        onClearFilters();
        setLocalName("");
        setLocalEmail("");
        setLocalSalary("");
    };
    return (
        <Paper
            elevation={0}
            sx={{
                mb: 2,
                p: { xs: 1.5, sm: 2, md: 2.5 },
                borderRadius: 1.5,
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg)",
                background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-light) 100%)",
            }}
        >
            {/* Filter Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                }}
            >
                <FilterAltIcon
                    sx={{
                        color: "var(--primary)",
                        fontSize: "1.125rem",
                    }}
                />
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 600,
                        color: "var(--text)",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                >
                    Filter & Manage Records
                </Typography>
            </Box>

            {/* Main Controls Row - All in one line on desktop */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: { xs: 1, sm: 1, md: 1.25 },
                    flexWrap: "wrap",
                }}
            >
                {/* Filter Inputs */}
                <TextField
                    label="Name"
                    size="small"
                    placeholder="John Doe"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    sx={{
                        flex: { xs: 1, sm: "0 1 calc(25% - 10px)", md: "0 1 200px" },
                        minWidth: { xs: 0, sm: "140px" },
                        height: inputHeight,
                        "& .MuiOutlinedInput-root": {
                            height: inputHeight,
                            borderRadius: "8px",
                            transition: "all 0.2s",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--primary)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--primary)",
                                borderWidth: 2,
                            },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--border)",
                        },
                    }}
                />

                <TextField
                    label="Email"
                    size="small"
                    placeholder="email@example.com"
                    value={localEmail}
                    onChange={(e) => setLocalEmail(e.target.value)}
                    sx={{
                        flex: { xs: 1, sm: "0 1 calc(25% - 10px)", md: "0 1 220px" },
                        minWidth: { xs: 0, sm: "140px" },
                        height: inputHeight,
                        "& .MuiOutlinedInput-root": {
                            height: inputHeight,
                            borderRadius: "8px",
                            transition: "all 0.2s",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--primary)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--primary)",
                                borderWidth: 2,
                            },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--border)",
                        },
                    }}
                />

                <TextField
                    label="Min Salary"
                    type="number"
                    size="small"
                    placeholder="0"
                    value={localSalary}
                    onChange={(e) => setLocalSalary(e.target.value)}
                    sx={{
                        flex: { xs: 1, sm: "0 1 calc(20% - 10px)", md: "0 1 150px" },
                        minWidth: { xs: 0, sm: "100px" },
                        height: inputHeight,
                        "& .MuiOutlinedInput-root": {
                            height: inputHeight,
                            borderRadius: "8px",
                            transition: "all 0.2s",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--primary)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--primary)",
                                borderWidth: 2,
                            },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--border)",
                        },
                    }}
                />

                {/* Action Buttons */}
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ClearIcon sx={{ fontSize: "1.2rem" }} />}
                    onClick={handleClear}
                    sx={{
                        flex: { xs: 1, sm: "0 1 auto" },
                        minWidth: { xs: 0, sm: "140px" },
                        height: inputHeight,
                        borderColor: "var(--border)",
                        backgroundColor: "var(--danger)",
                        color: "var(--text)",
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        borderRadius: "8px",
                        transition: "all 0.2s",
                        border: "1.5px solid var(--border)",
                        "&:hover": {
                            borderColor: "var(--danger)",
                            backgroundColor: "rgba(246, 60, 60, 0.08)",
                            borderWidth: "1.5px",
                        },
                    }}
                >
                    Clear
                </Button>

                <Button
                    variant="contained"
                    size="small"
                    startIcon={<FileDownloadIcon sx={{ fontSize: "1.2rem" }} />}
                    onClick={onExportCSV}
                    sx={{
                        flex: { xs: 1, sm: "0 1 auto" },
                        minWidth: { xs: 0, sm: "150px" },
                        height: inputHeight,
                        color: "var(--text)",
                        backgroundColor: "var(--primary)",
                        background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        borderRadius: "8px",
                        transition: "all 0.2s",
                        boxShadow: "0 2px 6px rgba(37, 99, 235, 0.22)",
                        border: "none",
                        "&:hover": {
                            boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)",
                            transform: "translateY(-1px)",
                        },
                        "&.Mui-disabled": {
                            opacity: 0.7,
                            color: "rgba(255,255,255,0.8)",
                        },
                    }}
                >
                    Export CSV
                </Button>

                {/* Undo Button */}
                <Tooltip title={undoAvailable ? `Undo last change` : "No changes to undo"}>
                    <span>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RestartAltIcon sx={{ fontSize: "1.2rem" }} />}
                            disabled={!undoAvailable}
                            onClick={onUndo}
                            sx={{
                                flex: { xs: 1, sm: "0 1 auto" },
                                minWidth: { xs: 0, sm: "140px" },
                                height: inputHeight,
                                borderColor: "var(--border)",
                                color: "var(--text)",
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: "0.9rem",
                                borderRadius: "8px",
                                transition: "all 0.2s",
                                border: "1.5px solid var(--border)",
                                "&:hover:not(:disabled)": {
                                    borderColor: "var(--warning)",
                                    backgroundColor: "rgba(245, 158, 11, 0.08)",
                                    borderWidth: "1.5px",
                                },
                                "&:disabled": {
                                    opacity: 0.6,
                                    borderColor: "var(--border)",
                                },
                            }}
                        >
                            Undo
                        </Button>
                    </span>
                </Tooltip>

                {/* Total Records - Flex spacer on mobile, right-aligned on desktop */}
                <Box sx={{ flex: { xs: "1 1 100%", sm: "1", md: "0 1 auto" } }} />

                <Typography
                    variant="body2"
                    sx={{
                        color: "var(--text-light)",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        fontSize: { xs: "0.9rem", md: "0.95rem" },
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    Total: <Box component="span" sx={{ color: "var(--primary)", fontWeight: 700 }}>{totalRows}</Box>
                </Typography>
            </Box>
        </Paper>
    );
};

export default React.memo(TableToolbar);