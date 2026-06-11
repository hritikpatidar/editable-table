import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee } from "../../types/employee";

interface SortState {
  sortField: keyof Employee;
  sortDirection: "asc" | "desc";
}

const initialState: SortState = {
  sortField: "id",
  sortDirection: "asc",
};

const sortSlice = createSlice({
  name: "sort",
  initialState,
  reducers: {
    setSortField: (state, action: PayloadAction<keyof Employee>) => {
      state.sortField = action.payload;
    },
    setSortDirection: (
      state,
      action: PayloadAction<"asc" | "desc">
    ) => {
      state.sortDirection = action.payload;
    },
    setSort: (
      state,
      action: PayloadAction<{
        sortField: keyof Employee;
        sortDirection: "asc" | "desc";
      }>
    ) => {
      state.sortField = action.payload.sortField;
      state.sortDirection = action.payload.sortDirection;
    },
  },
});

export const { setSortField, setSortDirection, setSort } = sortSlice.actions;
export default sortSlice.reducer;
