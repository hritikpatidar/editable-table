import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaginationState {
  page: number;
  rowsPerPage: number;
}

const initialState: PaginationState = {
  page: 0,
  rowsPerPage: 25,
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.page = 0; 
    },
  },
});

export const { setPage, setRowsPerPage } = paginationSlice.actions;
export default paginationSlice.reducer;
