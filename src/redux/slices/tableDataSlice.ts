import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee } from "../../types/employee";
import { generateData } from "../../data/generateData";

interface TableDataState {
  rows: Employee[];
  undoHistory: Employee[][];
}

const initialState: TableDataState = {
  rows: generateData(10000),
  undoHistory: [],
};

const tableDataSlice = createSlice({
  name: "tableData",
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<Employee[]>) => {
      state.rows = action.payload;
    },
    updateRow: (state, action: PayloadAction<Employee>) => {
      const index = state.rows.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.undoHistory.push([...state.rows]);
        state.rows[index] = action.payload;
      }
    },
    addUndoHistory: (state) => {
      state.undoHistory.push([...state.rows]);
    },
    undo: (state) => {
      if (state.undoHistory.length > 0) {
        const previousState = state.undoHistory.pop();
        if (previousState) {
          state.rows = previousState;
        }
      }
    },
    clearUndoHistory: (state) => {
      state.undoHistory = [];
    },
  },
});

export const { setRows, updateRow, addUndoHistory, undo, clearUndoHistory } =
  tableDataSlice.actions;
export default tableDataSlice.reducer;
