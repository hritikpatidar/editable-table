import React from "react";
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

interface TableToolbarProps {
    nameFilter: string;
    emailFilter: string;
    salaryFilter: string;
    setNameFilter: (value: string) => void;
    setEmailFilter: (value: string) => void;
    setSalaryFilter: (value: string) => void;
    onClearFilters: () => void;
    onExportCSV: () => void;
    totalRows: number;
}

const TableToolbar: React.FC< TableToolbarProps> = ({
    nameFilter,
    emailFilter,
    salaryFilter,
    setNameFilter,
    setEmailFilter,
    setSalaryFilter,
    onClearFilters,
    onExportCSV,
    totalRows,
}) => {
        return (
            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#fff",
                }}
            >
                <Stack
                    spacing={2}
                    sx={{
                        flexDirection: {
                            xs: "column",
                            md: "row",
                        },
                        alignItems: {
                            xs: "stretch",
                            md: "center",
                        },
                        justifyContent: "space-between",
                    }}
                >
                    <Stack
                        sx={{
                            display: "flex",
                            gap: 2,
                            flex: 1,
                            flexDirection: {
                                xs: "column",
                                md: "row",
                            },
                        }}
                    >
                        <TextField
                            label="Filter Name"
                            size="small"
                            value={nameFilter}
                            onChange={(e) =>setNameFilter(e.target.value )}
                        />

                        <TextField
                            label="Filter Email"
                            size="small"
                            value={emailFilter}
                            onChange={(e) =>setEmailFilter( e.target.value )}
                        />

                        <TextField
                            label="Min Salary"
                            type="number"
                            size="small"
                            value={salaryFilter}
                            onChange={(e) => setSalaryFilter(e.target.value)}
                        />
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={ onClearFilters}
                        >
                            Clear Filters
                        </Button>

                        <Button
                            variant="contained"
                            onClick={onExportCSV}
                        >
                            Export CSV
                        </Button>
                    </Stack>
                </Stack>

                <Typography
                    variant="body2"
                    sx={{
                        mt: 2,
                        color: "text.secondary",
                    }}
                >
                    Total Records: {totalRows}
                </Typography>
            </Box>
        );
    };

export default React.memo(TableToolbar);