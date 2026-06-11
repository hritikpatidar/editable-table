import React from "react";
import {
  Box,
  TablePagination,
} from "@mui/material";

interface PaginationProps {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handlePageChange = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Box
      sx={{
        borderTop: "1px solid var(--border)",
        mt: 2,
        backgroundColor: "var(--bg-light)",
        borderRadius: "0 0 6px 6px",
        "& .MuiTablePagination-root": {
          fontSize: { xs: "0.85rem", md: "0.95rem" },
        },
        "& .MuiTablePagination-selectLabel": {
          mb: 0,
        },
        "& .MuiTablePagination-displayedRows": {
          mb: 0,
        },
        "& .MuiSelect-standard": {
          color: "var(--text)",
        },
        "& .MuiIconButton-root": {
          color: "var(--text-light)",
          transition: "all 0.2s",
          "&:hover:not(:disabled)": {
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            color: "var(--primary)",
          },
          "&:disabled": {
            opacity: 0.4,
          },
        },
      }}
    >
      <TablePagination
        component="div"
        count={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Box>
  );
};

export default React.memo(Pagination);