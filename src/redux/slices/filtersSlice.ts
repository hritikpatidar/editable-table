import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  nameFilter: string;
  emailFilter: string;
  salaryFilter: string;
}

const initialState: FiltersState = {
  nameFilter: "",
  emailFilter: "",
  salaryFilter: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.nameFilter = action.payload;
    },
    setEmailFilter: (state, action: PayloadAction<string>) => {
      state.emailFilter = action.payload;
    },
    setSalaryFilter: (state, action: PayloadAction<string>) => {
      state.salaryFilter = action.payload;
    },
    clearFilters: (state) => {
      state.nameFilter = "";
      state.emailFilter = "";
      state.salaryFilter = "";
    },
  },
});

export const { setNameFilter, setEmailFilter, setSalaryFilter, clearFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
