import { useDispatch, useSelector } from "react-redux";
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
    addUndoHistory,
    clearUndoHistory,
} from "../redux/slices/tableDataSlice";
import { Employee } from "../types/employee";

/**
 * Hook for accessing and updating filter state
 */
export const useFilters = () => {
    const dispatch = useDispatch<AppDispatch>();
    const nameFilter = useSelector((state: RootState) => state.filters.nameFilter);
    const emailFilter = useSelector((state: RootState) => state.filters.emailFilter);
    const salaryFilter = useSelector((state: RootState) => state.filters.salaryFilter);

    return {
        nameFilter,
        emailFilter,
        salaryFilter,
        setNameFilter: (val: string) => dispatch(setNameFilter(val)),
        setEmailFilter: (val: string) => dispatch(setEmailFilter(val)),
        setSalaryFilter: (val: string) => dispatch(setSalaryFilter(val)),
        clearFilters: () => dispatch(clearFilters()),
    };
};

/**
 * Hook for accessing and updating pagination state
 */
export const usePagination = () => {
    const dispatch = useDispatch<AppDispatch>();
    const page = useSelector((state: RootState) => state.pagination.page);
    const rowsPerPage = useSelector((state: RootState) => state.pagination.rowsPerPage);

    return {
        page,
        rowsPerPage,
        setPage: (page: number) => dispatch(setPage(page)),
        setRowsPerPage: (rowsPerPage: number) => dispatch(setRowsPerPage(rowsPerPage)),
    };
};

/**
 * Hook for accessing and updating sort state
 */
export const useSort = () => {
    const dispatch = useDispatch<AppDispatch>();
    const sortField = useSelector((state: RootState) => state.sort.sortField);
    const sortDirection = useSelector((state: RootState) => state.sort.sortDirection);

    return {
        sortField,
        sortDirection,
        setSortField: (field: keyof Employee) => dispatch(setSortField(field)),
        setSortDirection: (direction: "asc" | "desc") => dispatch(setSortDirection(direction)),
        setSort: (field: keyof Employee) => {
            if (sortField === field) {
                dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
            } else {
                dispatch(setSort({ sortField: field, sortDirection: "asc" }));
            }
        },
    };
};

/**
 * Hook for accessing and updating editing state
 */
export const useEditing = () => {
    const dispatch = useDispatch<AppDispatch>();
    const editingRowId = useSelector((state: RootState) => state.editing.editingRowId);
    const draftRow = useSelector((state: RootState) => state.editing.draftRow);
    const hasUnsavedChanges = useSelector((state: RootState) => state.editing.hasUnsavedChanges);

    return {
        editingRowId,
        draftRow,
        hasUnsavedChanges,
        startEditing: (rowId: number, draftRow: Employee) =>
            dispatch(startEditing({ rowId, draftRow })),
        updateDraftRow: (row: Employee) => dispatch(updateDraftRow(row)),
        cancelEditing: () => dispatch(cancelEditing()),
        clearEditing: () => dispatch(clearEditing()),
    };
};

/**
 * Hook for accessing and updating table data
 */
export const useTableData = () => {
    const dispatch = useDispatch<AppDispatch>();
    const rows = useSelector((state: RootState) => state.tableData.rows);
    const undoHistory = useSelector((state: RootState) => state.tableData.undoHistory);

    return {
        rows,
        undoHistory,
        updateRow: (row: Employee) => dispatch(updateRow(row)),
        addUndoHistory: () => dispatch(addUndoHistory()),
        undo: () => dispatch(undo()),
        clearUndoHistory: () => dispatch(clearUndoHistory()),
    };
};
