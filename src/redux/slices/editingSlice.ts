import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee } from "../../types/employee";

interface EditingState {
  editingRowId: number | null;
  draftRow: Employee | null;
  hasUnsavedChanges: boolean;
}

const initialState: EditingState = {
  editingRowId: null,
  draftRow: null,
  hasUnsavedChanges: false,
};

const editingSlice = createSlice({
  name: "editing",
  initialState,
  reducers: {
    startEditing: (
      state,
      action: PayloadAction<{ rowId: number; draftRow: Employee }>
    ) => {
      state.editingRowId = action.payload.rowId;
      state.draftRow = action.payload.draftRow;
      state.hasUnsavedChanges = false;
    },
    updateDraftRow: (state, action: PayloadAction<Employee>) => {
      state.draftRow = action.payload;
      state.hasUnsavedChanges = true;
    },
    cancelEditing: (state) => {
      state.editingRowId = null;
      state.draftRow = null;
      state.hasUnsavedChanges = false;
    },
    clearEditing: (state) => {
      state.editingRowId = null;
      state.draftRow = null;
      state.hasUnsavedChanges = false;
    },
  },
});

export const { startEditing, updateDraftRow, cancelEditing, clearEditing } =
  editingSlice.actions;
export default editingSlice.reducer;
